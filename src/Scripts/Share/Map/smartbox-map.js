/**
 * Developer    :   SongQian
 * Time         :   2019-05-27
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   地图组件
 */
import { Map, View } from 'ol'
import { transform, toLonLat, get as getProjection} from 'ol/proj'
import { Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import { XYZ} from 'ol/source'
import { Vector as VectorSource} from 'ol/source'
import { Style, Icon} from 'ol/style'
import { Point } from 'ol/geom'
import { Draw, Modify } from 'ol/interaction'
import { mapGetters } from 'vuex'

export default (function() {
    let map = null;
    let drawLayers = new VectorLayer({
        id: 'draw-vector-layer',
        style : (feature) => {
            if(feature.getGeometry() instanceof Point) {
                return new Style({
                    image : new Icon({
                        anchor: [16, 0.5],
                        anchorOrigin : 'bottom-left',
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        src: require('~/assets/Images/location.png'),
                        size: [32, 32],
                        imgSize: [32, 32]
                    })
                })
            }
            return null;
        },
        source: new VectorSource({
            wrapX: false
        })
    });

    return {
        name : 'SmartBoxMap',
        props : {
            X : {
                default : 0,
                type : Number
            },
            Y : {
                default : 0,
                type : Number
            },
            Center : {
                default : [0, 0],
                type : Array
            },
            Width : {
                default : 'auto',
                type : String|Number
            },
            Height : {
                default : 'auto',
                type : String|Number
            }
        },
        computed :  {
            getStyles () {
                let me = this;
                let width = typeof me.Width === "number" ?  me.Width + 'px' : me.Width;
                let height = typeof me.Height === "number" ?  me.Height + 'px' : me.Height;
                return { width, height };
            },
            ...mapGetters({
                getMapZoom : 'Sys/getMapZoom',
                getMapMinZoom : 'Sys/getMapMinZoom',
                getMapMaxZoom : 'Sys/getMapMaxZoom',
                // getMapExtent : 'Sys/getMapExtent',
                // getViewExtent : 'Sys/getViewExtent',
                // getMapCenter : 'Sys/getMapCenter',
                getMapUrl : 'Sys/getMapUrl'
            })
        },
        methods : {
            init() {
                let me = this;
                map = new Map({
                    view: new View({
                        center: transform(me.Center, "EPSG:4326", "EPSG:3857"),
                        extent : getProjection("EPSG:3857").getExtent(),
                        maxZoom: me.getMapMaxZoom,
                        minZoom: me.getMapMinZoom,
                        zoom: me.getMapZoom,
                        projection: "EPSG:3857",
                        rotation: 0
                    }),
                    layers: [
                        new TileLayer({
                            id: 'smart-box',
                            // source: new XYZ({
                            //     url: me.getMapUrl,
                            //     wrapX: false,
                            //     tileSize: [256, 256],
                            //     projection: "EPSG:3857"
                            // })
                            source : new TileImage({
                                projection: "EPSG:3857",
                                tileGrid: new TileGrid({
                                    origin: [0, 0],
                                    resolutions: (new Array(18).fill(' ').map((it, i) => Math.pow(2, 18 - i)))
                                }),
                                tileUrlFunction: function(coord, pixelRatio, proj) {
                                    let z = coord[0];
                                    let x = coord[1];
                                    let y = coord[2];
                                    if (x < 0) {
                                        x = -x;
                                    }

                                    if(y < 0) {
                                        y = -y;
                                    }
                                    return vm.getMapUrl.replace(/(\{z\})/g, z).replace(/(\{x\})/g, x).replace(/(\{y\})/g, y);
                                }
                            })
                        })
                    ],
                    target: this.$refs.map
                });
            },
            EnablePosition () {
                let me = this;
                map.addLayer(drawLayers);
                let source = drawLayers.getSource();
                let draw = new Draw({ source, type : 'Point' });
                let modify = new Modify({ source });
                source.on("addfeature", (e) => {
                    map.removeInteraction(draw);
                    source.un("addfeature");
                    let feature = e.feature;
                    let coordinate = toLonLat(feature.getGeometry().getCoordinates());
                    me.$emit("update:x", coordinate[0] || 0);
                    me.$emit("update:y", coordinate[1] || 0);
                    draw = null;
                });
                source.on("changefeature", (e) => {
                    let feature = e.feature;
                    let coordinate = toLonLat(feature.getGeometry().getCoordinates());
                    me.$emit("update:x", coordinate[0] || 0);
                    me.$emit("update:y", coordinate[1] || 0);
                    modify = null;
                })
                map.addInteraction(draw);
                map.addInteraction(modify);
            },
            DisablePosition() {
                let me = this;
                let source = drawLayers.getSource();
                source.clear();
                let interactions = map.getInteractions();
                interactions.forEach(it => {
                    if(it instanceof Draw || it instanceof Modify) {
                        map.removeInteraction(it);
                    }
                })
            }
        },
        mounted() {
            let me = this;
            me.init();
        },
        beforeDestroy() {
            map = null;
        }
    }
})()