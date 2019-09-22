<template>
  <div id="sv_container" ref="container">
    <canvas id='sv_canvas'></canvas>
  </div>
</template>
<style>
  #sv_container {
    width: 100%;
    height: 100%;
  }

  #sv_canvas {
    width: 100%;
    height: 100%;
  }
</style>
<script>
  import * as THREE from 'three'
  import axios from "axios";

  export default {
    data: () => ({
      uid: null,
      infoUrl: null,
      imgUrl: null,
      scene: null,
      camera: null,
      renderer: null,
      material: null,
      arrowGroup: null,
      texArrow: null,
      isUserInteracting: false,
      selectedObject: null,
      mouseVector: null,
      raycaster: null,
      onMouseDownMouseX: 0,
      onMouseDownMouseY: 0,
      lon: 0,
      onMouseDownLon: 0,
      lat: 0,
      onMouseDownLat: 0,
      phi: 0,
      theta: 0,
      delta: 0,
      canvas: null
    }),
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        this.uid = this.$route.params.uid;
        this.imgUrl = "http://localhost:9092/api/sv/image?z=4&id=";
        this.infoUrl = "http://localhost:9092/api/sv/info?uid=" + this.uid + "&geoid=";
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector3();
        axios.get("http://localhost:9092/api/data/region/entry/" + this.uid).then((rsp) => {
          if (rsp.data.data && rsp.data.data.length > 0)
            this.initRegion(rsp.data.data[0].geoid);
        }).catch(err => {
          console.log(err);
        });
        this.initMesh();
      },
      initRegion(entry) {
        console.log(entry);
        this.loadData(entry);
      },
      initMesh() {
        var mesh;

        this.canvas = document.getElementById('sv_canvas');
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.camera.target = new THREE.Vector3(1, 0, 0);
        this.camera.position.set(0, 0, 0);

        this.scene = new THREE.Scene();

        var geometry = new THREE.SphereBufferGeometry(1000, 60, 40);
        geometry.scale(-1, 1, 1);

        var loader = new THREE.TextureLoader();
        var texture = loader.load('static/pano/pano.jpg');
        this.texArrow = loader.load("static/img/arrow.jpg");
        this.material = new THREE.MeshBasicMaterial({map: texture});
        mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);


        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setViewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        let axes = new THREE.AxesHelper(20);
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, 0, 0);
        spotLight.castShadow = true;
        this.scene.add(axes);
        this.scene.add(spotLight);

        this.$refs.container.append(this.renderer.domElement);
        document.addEventListener('mousedown', this.onPointerStart, false);
        document.addEventListener('mousemove', this.onPointerMove, false);
        document.addEventListener('mouseup', this.onPointerUp, false);
        document.addEventListener('wheel', this.onDocumentMouseWheel, false);
        document.addEventListener('touchstart', this.onPointerStart, false);
        document.addEventListener('touchmove', this.onPointerMove, false);
        document.addEventListener('touchend', this.onPointerUp, false);
        window.addEventListener('resize', this.onWindowResize, false);

        this.renderScene();
      },
      renderScene() {
        requestAnimationFrame(this.renderScene);
        this.update();
      },
      onWindowResize() {
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        // this.camera.updateProjectionMatrix();
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setViewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
      },

      onPointerStart(event) {
        this.isUserInteracting = true;

        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;

        this.onMouseDownMouseX = clientX;
        this.onMouseDownMouseY = clientY;

        this.onMouseDownLon = this.lon;
        this.onMouseDownLat = this.lat;
      },

      onPointerMove(event) {
        if (this.isUserInteracting === true) {
          var clientX = event.clientX || event.touches[0].clientX;
          var clientY = event.clientY || event.touches[0].clientY;

          this.lon = (this.onMouseDownMouseX - clientX) * 0.1 + this.onMouseDownLon;
          this.lat = (clientY - this.onMouseDownMouseY) * 0.1 + this.onMouseDownLat;
        }
        if(this.selectedObject){
          this.selectedObject.material.color.set("#ff0000");
          this.selectedObject = null;
        }

        var intersects = this.getIntersects(event.layerX, event.layerY);
        if(intersects.length > 0){
          var res = intersects.filter(function(res){
            return res && res.object;
          })[0];

          if(res && res.object){
            this.selectedObject = res.object;
            this.selectedObject.material.color.set("#99ffff");
          }
        }
      },
      getIntersects(x, y){
        x = (x / window.innerWidth) * 2 - 1;
        y = -(y / window.innerHeight) * 2 + 1;
        this.mouseVector.set(x, y, 0.5);
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        return this.raycaster.intersectObject(this.arrowGroup, true);
      },
      onPointerUp() {
        this.isUserInteracting = false;
        if(this.selectedObject && this.selectedObject.onclick)
          this.selectedObject.onclick();
      },
      onDocumentMouseWheel(event) {
        var fov = this.camera.fov + event.deltaY * 0.05;
        this.camera.fov = THREE.Math.clamp(fov, 10, 75);
        this.camera.updateProjectionMatrix();
      },
      addArrow(dir, geoid) {
        dir += Math.PI;
        var color = 0xff0000;
        var mat = new THREE.MeshBasicMaterial({map: this.texArrow, color: color, fog: true});
        mat.transparent = true;
        var shape = new THREE.Shape();
        shape.moveTo(0, 1);
        shape.lineTo(-1, 0);
        shape.lineTo(1, 0);
        shape.lineTo(0, 1);
        var geo = new THREE.BoxGeometry(50, 50, 0);
        var arrow = new THREE.Mesh(geo, mat);

        arrow.rotateY(dir);
        arrow.rotateX(Math.PI / 2);

        arrow.position.set(Math.cos(dir), 0, Math.sin(dir));
        arrow.position.multiplyScalar(300);
        arrow.position.y = -200;
        console.log("add arrow of " + geoid + " on dir " + dir + " with color " + color);
        this.arrowGroup.add(arrow);
        arrow.geoid = geoid;
        return arrow;
      },
      addNext(dir, geoid) {
        let {pano} = this;
        var obj = this.addArrow(dir, geoid);
        obj.p = this;
        obj.onclick = function () {
          this.p.loadData(this.geoid);
        }
      },
      setTex(tex){
        this.material.setValues({map: tex});
        this.material.map.needsUpdate = true;
      },
      changePanoWithUrl(url) {
        new THREE.TextureLoader().load(url, this.setTex, function () {
        }, function (err) {
          console.log("err while load tex");
          console.log(err);
        });
      },
      loadPano(data) {
        this.changePanoWithUrl(this.imgUrl + data.layers[0].panoid);
        if (data.links) for (var link of data.links) {
          this.addNext(link.dir, link.id);
        }
      },
      message(type, msg){
        this.$Message[type]({
          background: true,
          content: msg
        });
      },
      loadData(geoid) {
        axios.get(this.infoUrl + geoid).then((rsp) => {
          if (rsp.data && rsp.data.status != "ok") {
            // warn_notify(rsp.data.data.msg);
            // $("#loading").hide();
            this.message("warning", rsp.data.msg);
            return;
          }

          this.scene.remove(this.arrowGroup);
          this.arrowGroup = new THREE.Group();
          this.scene.add(this.arrowGroup);
          this.loadPano(rsp.data.data);
        }).catch(err => {
          console.log(err);
        });
      },
      update() {
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.Math.degToRad(90 - this.lat);
        this.theta = THREE.Math.degToRad(this.lon);

        this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        this.camera.target.y = 500 * Math.cos(this.phi);
        this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

        this.camera.lookAt(this.camera.target);
        this.renderer.render(this.scene, this.camera);
      }
    }
  }
</script>
