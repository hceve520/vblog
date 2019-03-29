
/**
 * @author  LiBingya on 2018/7/26.
 * @editor  Begisen 20180803
 * @constant:修改esrilayer底图图层为tilemapLayer及部分bug
 */

(function (win) {

    /**
     * 接口总入口
	 * @author  LiBingya on 2018/7/26.
     * @type {{}}
     */
    win.Z = {};


    /**
     * esriTileLayer初始化方法
     */
    const esriTileLayer = L.TileLayer.extend({
        getTileUrl: function (tilePoint) {
            var oo = '00000000';
            var xx = tilePoint.x.toString(16);
            xx = 'C' + oo.substring(0, 8 - xx.length) + xx;
            var yy = tilePoint.y.toString(16);
            yy = 'R' + oo.substring(0, 8 - yy.length) + yy;

            return L.Util.template(this._url, L.extend({
                s: this._getSubdomain(tilePoint),
                z: tilePoint.z.toString().length > 1 ? 'L' + tilePoint.z : 'L0' + tilePoint.z,
                x: xx, // 注意切片命名的大小写
                y: yy
            }, this.options));

        }
    });

    /**
     * wgs84转墨卡托
     * @param lng 经度
     * @param lat 纬度
     * @returns {[*,*]}
     */
    function lonLatToWebMercator(lng, lat) {
        var x = lng * 20037508.34 / 180;
        var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
        y = y * 20037508.34 / 180;
        return [x, y];
    }

    /**
     * 墨卡托转wgs84
     * @param x
     * @param y
     * @returns {[*,*]}
     */
    function webMercator2lonlat(x, y) {
        let lon = x / 20037508.34 * 180;
        let lat = y / 20037508.34 * 180;
        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
        return [lon, lat];
    }

    /**
     * 根据圆心，半径，点数，生成圆圈坐标
     * @param coordString 圆心，'33,120'
     * @param radius 半径 ，米
     * @returns {string} 圆坐标串  '120,21 120,22 121,22 ...'
     */
    function getCircleRing(coordString, radius, ringLen) {
        let pointstr = coordString.split(',').reverse();
        let point = [parseFloat(pointstr[0]), parseFloat(pointstr[1])];
        let pointWeb = lonLatToWebMercator(point[0], point[1]);
        let circleRing = [];
        let circleRingl = '';
        let startPoint;
        let len = ringLen == undefined ? 30 : ringLen;
        for (let i = 0; i < len; i++) {
            let angle = i * 12;
            let x = pointWeb[0] + radius * Math.cos(angle * 3.14 / 180)
            let y = pointWeb[1] + radius * Math.sin(angle * 3.14 / 180);
            let pointl = webMercator2lonlat(x, y);
            circleRing.push(pointl);
            let pointlStr = pointl[0] + ',' + pointl[1];
            circleRingl = circleRingl + pointlStr + ' ';
            if (i == 0) {
                startPoint = pointl;
            }
        }
        return circleRingl + startPoint[0] + ',' + startPoint[1];
    }

    /**
     * 产生随机十六进制颜色代码
     */
    function getColor(){
        var colorValue="0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";                       
        var colorArray = colorValue.split(",");                
        var color="#";           
        for(var i=0;i<6;i++){                 
            color+=colorArray[Math.floor(Math.random()*16)];               
        }
        return color;           
    }

    /**
     * 计算两点间距离
     * @param p1
     * @param p2
     * @returns {*}
     */
    function getDistance(p1, p2) {
        return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
    }

    /**
     * 获取当前时间
     * @returns {string}
     */
    function getCurrentTime() {
        let date = new Date();
        let sign1 = '-';
        let sign2 = ':';
        let year = date.getFullYear(); // 年
        let month = date.getMonth() + 1; // 月
        let day = date.getDate(); // 日
        let hour = date.getHours(); // 时
        let minutes = date.getMinutes(); // 分
        let seconds = date.getSeconds() //秒
        // let weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
        // let week = weekArr[date.getDay()];
        // 给一位数数据前面加 '0”
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (day >= 0 && day <= 9) {
            day = '0' + day;
        }
        if (hour >= 0 && hour <= 9) {
            hour = '0' + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = '0' + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = '0' + seconds;
        }
        let currentdate = year + sign1 + month + sign1 + day + ' ' + hour + sign2 + minutes + sign2 + seconds;
        return currentdate;
    }

    //点击地图或悬停1秒埋点信息
    function createStoreInfo4Type1(type, evtObj) {
        const userJson = sessionStorage.getItem('currentUser');
        if (!userJson) {
            return null;
        }

        let info = {};
        const currentTime = getCurrentTime();
        const user = JSON.parse(userJson);
        //用户id
        info.userId = user.userId;
        //用户手机
        info.phoneNumber = user.phoneNumber;
        //时间戳
        info.gisTimestamp = currentTime;
        //单击地图
        if ('clickFeatureLayer' == type) {
            info.clickOrSuspend = '0';
        }
        //地图悬浮一秒
        else {
            info.clickOrSuspend = '1';
        }
        info.addressId = evtObj.featureAttr.addressid;
        if (evtObj.latlng) {
            info.clickOrSuspendGisId = evtObj.latlng.lat + ',' + evtObj.latlng.lng;
        } else {
            info.clickOrSuspendGisId = '';
        }

        //返回地图像素分辨率
        if (evtObj.resolution) {
            info.scale = JSON.stringify(evtObj.resolution);
        } else {
            info.scale = evtObj.zoom;
        }
        return info;
    }

    //点击地图或悬停1秒埋点信息
    function createStoreInfo4Type2(type, evtObj) {
        const userJson = sessionStorage.getItem('currentUser');
        if (!userJson) {
            return null;
        }

        let info = {};
        const currentTime = getCurrentTime();
        const user = JSON.parse(userJson);
        //用户id
        info.userId = user.userId;
        //用户手机
        info.phoneNumber = user.phoneNumber;
        //时间戳
        info.gisTimestamp = currentTime;
        info.operationName = type;
        if (evtObj.latlng) {
            info.coordinate = evtObj.latlng.lat + ',' + evtObj.latlng.lng;
        } else {
            info.coordinate = '';
        }

        //返回地图像素分辨率
        if (evtObj.resolution) {
            info.scale = JSON.stringify(evtObj.resolution);
        } else {
            info.scale = evtObj.zoom;
        }
        //返回中心矩形的坐标范围，默认大小：300*200 px
        if (evtObj.centerRectBounds) {
            info.currentCenter = evtObj.centerRectBounds.northEast.lat + ',' + evtObj.centerRectBounds.northEast.lng + ' ' +
                evtObj.centerRectBounds.southWest.lat + evtObj.centerRectBounds.southWest.lng;
        } else {
            evtObj.centerRectBounds = '';
        }

        return info;
    }

    /**
     * 埋点调用方法
     * @param type
     * @param evt
     */
    function storeOperateInfo(type, event) {
        if (!type || !event) {
            return;
        }
        const sendTypeObj = {
            'clickFeatureLayer': '1', //点击地图要素
            // 'mousemove map': '1',//鼠标悬停1秒
            'zoomInMap': '2', //放大
            'zoomOutMap': '2', //缩小
            'moveendMap': '2' //拖拽
        }
        const sendType = sendTypeObj[type];
        let info = null;
        if ('1' === sendType) {
            info = createStoreInfo4Type1(type, event);
        } else if ('2' === sendType) {
            info = createStoreInfo4Type2(type, event);
        }
        if (!info) {
            return;
        }
        const productCode = sessionStorage.getItem('currentOpenProductCode');
        const params = {
            'appId': productCode ? productCode : '',
            'type': sendType,
            'createTime': getCurrentTime(),
            'datas': [info]
        };
        /*console.log(params);
        $.ajax({
            type: 'post',
            contentType: 'application/json',
            async: true,
            url: reqPrefix + '/api/product/etl/dataCollect',
            data: JSON.stringify(params),
            dataType: 'json',
            success: function () {}
        });*/
    }

    (function (z) {
        /**
         * zmap 类，地图类，包含常用方法和事件
		 * @class
         * @param {string} mapId map容器id
         * @param {object} options 地图参数
         * @param {array} options.center 地图中心坐标 [30,120]
         * @param {number} options.zoom 地图等级 默认4
         * @param {boolean} options.zoomControl 层级控制工具 默认false
         * @param {boolean} options.attributionControl 属性控制工具 默认false
         * @param {onject} options.crs 坐标系，'EPSG4326'，'EPSG3857'等,或使用proj4等定义的crs对象
         * @param {onject} options.minZoom 地图最小缩放层级
         * @param {onject} options.maxZoom 地图最大缩放层级
         */
        z.zmap=function(mapId, options) {
            let mapParam = options || {};

            //设置map初始化参数
            this.lMapId = mapId || '';
            this.center = mapParam.center || [32, 115];
            this.zoom = mapParam.zoom == undefined ? 4 : mapParam.zoom;
            let mapOpt = {
                center: this.center,
                zoom: this.zoom,
                zoomControl: false,
                attributionControl: false
            };
            if (mapParam.crs) {
                if (typeof (mapParam.crs) == 'string') {
                    mapOpt.crs = L.CRS[mapParam.crs];
                } else {
                    mapOpt.crs = mapParam.crs;
                }
            }
            // mapOpt.editable=true;//允许编辑

            //实例化map
            this.map = L.map(this.lMapId, mapOpt);
            //设置最小缩放等级
            if (mapParam.minZoom) {
                this.map.setMinZoom(mapParam.minZoom);
            }
            //设置最大缩放等级
            if (mapParam.maxZoom) {
                this.map.setMaxZoom(mapParam.maxZoom);
            }
            //设置添加图层参数
            if (mapParam.layerOption && mapParam.layerOption.type) {
                let layeroptions = mapParam.layerOption;
                this.addBaseLayerByUrl(layeroptions.type, layeroptions);
            }

            this.eventFunction = {};
            this.features = [];
            this.centerRectLayer = null;
            this._showCenterRectangle = false;

            this._eventTimer = {};
            this._eventSetTimeOut = {}; //延迟事件
            this._centerRectangleSize = [300, 200]; //中心矩形框大小默认值
            this._queryDelayTime = 1000; //毫秒

            this.mapTipLayer = null; //鼠标悬浮提示层

            //是否启动监听埋点
            this._keepListen = mapParam.keepListen || true;

            let self = this;
            this._lastZoom = this.map.getZoom();
            this._lastZoom1 = this.map.getZoom(); //用于判断moveend事件
            this._lastCenter = this.map.getCenter();
            //监听地图鼠标单击、拖动(停止1秒响应)、缩放(停止1秒响应)、鼠标悬停(停止1秒响应)、图层添加、图层删除
            this.map.on('zoomend moveend', function (evt) {
                //判断是否执行返回监听
                if (self._keepListen == true) {
                    let evtObj = {};
                    if (evt.type == 'mousemove') {

                        if (self._eventSetTimeOut['mousemove']) {
                            clearTimeout(self._eventSetTimeOut['mousemove']);
                            if (self.centerRectLayer) {
                                self.map.removeLayer(self.centerRectLayer.layer);
                                self.centerRectLayer = null;
                            }
                        }
                        //延迟事件，实现zoomend、moveend、mousemove等事件触发后，停止超过（1秒）则执行一次
                        self._eventSetTimeOut['mousemove'] = setTimeout(function () {

                            let bound = self.map.getBounds();
                            evtObj.bounds = {
                                northEast: bound._northEast,
                                southWest: bound._southWest
                            };
                            evtObj.center = self.map.getCenter();

                            evtObj.resolution = self.getResolution();
                            evtObj.centerRectBounds = self.getRectangleBouds(self._centerRectangleSize[0], self._centerRectangleSize[1]);

                            // if (self.centerRectLayer) {
                            //     self.map.removeLayer(self.centerRectLayer.layer);
                            //     self.centerRectLayer = null;
                            // }
                            // //添加中心矩形图层
                            // if (self._showCenterRectangle) {
                            //     let pointAry = [[evtObj.centerRectBounds.northEast.lat, evtObj.centerRectBounds.northEast.lng], [evtObj.centerRectBounds.southWest.lat, evtObj.centerRectBounds.northEast.lng], [evtObj.centerRectBounds.southWest.lat, evtObj.centerRectBounds.southWest.lng], [evtObj.centerRectBounds.northEast.lat, evtObj.centerRectBounds.southWest.lng], [evtObj.centerRectBounds.northEast.lat, evtObj.centerRectBounds.northEast.lng]]
                            //     self.centerRectLayer = new z.polygon(pointAry);
                            //     self.map.addLayer(self.centerRectLayer.layer);
                            // }

                            if (evt.latlng) {
                                evtObj.latlng = evt.latlng;
                            }
                            let zoom = self.map.getZoom();
                            evtObj.zoom = zoom;
                            let center = self.map.getCenter();
                            evtObj.center = center;

                            storeOperateInfo(evt.type + 'Map', evtObj);
                        }, self._queryDelayTime);
                    } else if (evt.type == 'moveend') {

                        if (self._eventSetTimeOut['moveend']) {
                            clearTimeout(self._eventSetTimeOut['moveend']);
                            if (self.centerRectLayer) {
                                self.map.removeLayer(self.centerRectLayer.layer);
                                self.centerRectLayer = null;
                            }
                        }
                        //延迟事件，实现zoomend、moveend、mousemove等事件触发后，停止超过（1秒）则执行一次
                        self._eventSetTimeOut['moveend'] = setTimeout(function () {

                            let bound = self.map.getBounds();
                            evtObj.bounds = {
                                northEast: bound._northEast,
                                southWest: bound._southWest
                            };
                            evtObj.center = self.map.getCenter();

                            evtObj.resolution = self.getResolution();
                            evtObj.centerRectBounds = self.getRectangleBouds(self._centerRectangleSize[0], self._centerRectangleSize[1]);

                            if (evt.latlng) {
                                evtObj.latlng = evt.latlng;
                            }
                            let zoom = self.map.getZoom();
                            evtObj.zoom = zoom;
                            let center = self.map.getCenter();
                            evtObj.center = center;
                            if (self._lastZoom1 == zoom) {
                                storeOperateInfo(evt.type + 'Map', evtObj);
                            } else {
                                self._lastZoom1 = zoom;
                            }

                        }, self._queryDelayTime);
                    } else if (evt.type == 'click') {
                        let bound = self.map.getBounds();
                        evtObj.bounds = {
                            northEast: bound._northEast,
                            southWest: bound._southWest
                        };
                        evtObj.center = self.map.getCenter();

                        evtObj.resolution = self.getResolution();
                        evtObj.centerRectBounds = self.getRectangleBouds(self._centerRectangleSize[0], self._centerRectangleSize[1]);

                        if (evt.latlng) {
                            evtObj.latlng = evt.latlng;
                        }

                        let zoom = self.map.getZoom();
                        evtObj.zoom = zoom;
                        let center = self.map.getCenter();
                        evtObj.center = center;

                        storeOperateInfo(evt.type + 'Map', evtObj);
                    } else if (evt.type == 'zoomend') {

                        if (self._eventSetTimeOut['zoomend']) {
                            clearTimeout(self._eventSetTimeOut['zoomend']);
                            if (self.centerRectLayer) {
                                self.map.removeLayer(self.centerRectLayer.layer);
                                self.centerRectLayer = null;
                            }
                        }
                        //延迟事件，实现zoomend、moveend、mousemove等事件触发后，停止超过（1秒）则执行一次
                        self._eventSetTimeOut['zoomend'] = setTimeout(function () {

                            let bound = self.map.getBounds();
                            evtObj.bounds = {
                                northEast: bound._northEast,
                                southWest: bound._southWest
                            };
                            evtObj.center = self.map.getCenter();

                            evtObj.resolution = self.getResolution();
                            evtObj.centerRectBounds = self.getRectangleBouds(self._centerRectangleSize[0], self._centerRectangleSize[1]);

                            if (evt.latlng) {
                                evtObj.latlng = evt.latlng;
                            }
                            let zoom = self.map.getZoom();
                            evtObj.zoom = zoom;
                            let center = self.map.getCenter();
                            evtObj.center = center;
                            let type = evt.type;
                            if (evt.type == 'zoomend' || evt.type == 'moveend') {
                                if (zoom > self._lastZoom) {
                                    type = 'zoomIn';
                                    // type = 'zoomIn' + (zoom - self._lastZoom);
                                } else if (zoom < self._lastZoom) {
                                    // type = 'zoomOut' + (self._lastZoom - zoom);
                                    type = 'zoomOut';
                                }
                                self._lastZoom = zoom;
                            }
                            storeOperateInfo(type + 'Map', evtObj);
                        }, self._queryDelayTime);

                    }

                }

            });


        }
        /**
         * zmap类的可配置属性
         * @type {}
         */
        z.zmap.prototype = {
            
            // //设置是否显示中心框
            // set showCenterRectangle(boolean) {
            //     this._showCenterRectangle = boolean;
            // },
            // //返回是否显示中心框状态
            // get showCenterRectangle() {
            //     return this._showCenterRectangle;
            // },
            //设置中心框大小，px
            // set centerRectangleSize(rectangleSize) {
            //     this._centerRectangleSize = rectangleSize;
            // },
            // //设置中心框大小，px
            // get centerRectangleSize() {
            //     return this._centerRectangleSize;
            // },
            /**
             * 设置悬停执行时间
             * @param {number} queryDelayTime 悬停时间
             */
            set queryDelayTime(queryDelayTime) {
                this._queryDelayTime = queryDelayTime;
            },
            get queryDelayTime() {
                return this._queryDelayTime;
            },
            /**
             * 设置是否埋点
             * @param {boolean} keepListen true or false
             */
            set keepListen(keepListen) {
                this._keepListen = keepListen;
            },
            get keepListen() {
                return this._keepListen;
            }

        };


        /**
         * 打开鼠标跟随提示框
         * @param {string} text 提示文本
         * @param options 选项
         * @param options.direction direction 方向：'auto'|'left'|'right'|'top'|'bottom'|'center'
         */
        z.zmap.prototype.opentip = function (text, options) {
            let opt = options || {};
            let toolTip = new L.tooltip({
                direction: opt.direction || 'right'
            });
            this.mapTipLayer = new L.circleMarker([0, 0], {
                opacity: 0,
                fillOpacity: 0
            }).bindTooltip(toolTip).addTo(this.map);
            this.mapTipLayer.openTooltip();
            this.mapTipLayer.setTooltipContent(text);
            let self = this;
            this.map.on('mousemove', function (evt) {
                if (self.mapTipLayer != null) {
                    let latlng = evt.latlng;
                    self.mapTipLayer.setLatLng(latlng);
                }
            })
        }
        /**
         * 关闭鼠标跟随提示框
         */
        z.zmap.prototype.closetip = function () {
            this.mapTipLayer.closeTooltip();
            if (this.mapTipLayer) {
                this.mapTipLayer.remove();
                this.mapTipLayer = null;
            }
        }
        /**
         * 返回已初始化的 leaflet 原生map对象
         * @returns {object} map对象
         */
        z.zmap.prototype.getLeafletMap = function () {
                return this.map;
        }
        /**
         * 判断是否包含feature，feature可为marker,polyline,polygon,circleMarker等
         * @param {object} feature zmap中矢量对象
         * @returns {boolean} 是否包含
         */
        z.zmap.prototype.hasFeature = function (feature) {
            return this.map.hasLayer(feature.layer);
        }
        /**
         * 判断是否包含featureLayer图层对象
         * @param {object} layer featureLayer图层对象
         * @returns {boolean} 是否包含
         */
        z.zmap.prototype.hasLayer = function (layer) {
            return this.map.hasLayer(layer.layer);
        }
        /**
         * zmap 类的添加底图方法
         * @param {string} type ,图层类型 value:TILELAYER|WMSLAYER|WMTSLAYER|ESRIMAPLAYER|ESRITILEMAPLAYER|ESRITILELAYER|GAODETILELAYER
         * @param {object} options 图层参数，options.url必填，坐标系要与map保持一致，地图默认为：'EPSG:4326”
         * @returns {object} 返回图层对象
         */
        z.zmap.prototype.addBaseLayerByUrl = function (type, options) {
            let layerOptions = options || {};
            let layer = null;
            let layerType = type.toUpperCase();
            switch (layerType) {
                case 'TILELAYER':
                    layer = L.tileLayer(layerOptions.url, {
                        noWrap: true
                    });
                    break;
                case 'WMSLAYER':
                    layer = L.tileLayer.wms(layerOptions.url, {
                        layers: layerOptions.layerName,
                        format: layerOptions.format || 'image/png'
                    });
                    break;
                case 'WMTSLAYER':
                    let leftTopLatLng = layerOptions.leftTopLatLng ? layerOptions.leftTopLatLng : [90, -180];
                    let matrixIds = [];
                    for (let i = 0; i < 22; ++i) {
                        matrixIds[i] = {
                            identifier: '' + i,
                            topLeftCorner: new L.LatLng(leftTopLatLng[0], leftTopLatLng[1])
                        };
                    }
                    let epsgNum = layerOptions.tilematrixSet ? layerOptions.tilematrixSet.replace(/[^0-9]/ig, '') : '';

                    let crs = L.CRS['EPSG' + epsgNum] || null;
                    if (crs == null || this.map.options.crs != crs) {
                        console.log('图层未设置坐标系或与Map坐标系不同，可能导致图层无法正常加载,请正确配置Map及图层坐标系！');
                    }

                    let layerOpt = {
                        layer: layerOptions.layerName || '', //图层名称
                        tilematrixSet: layerOptions.tilematrixSet || 'EPSG:4326',
                        format: layerOptions.format || 'image/png',
                        matrixIds: matrixIds
                    };
                    if (crs) {
                        layerOpt.crs = crs;
                    }
                    layer = new L.TileLayer.WMTS(layerOptions.url, layerOpt);
                    break;
                case 'ESRIMAPLAYER':
                    layer = L.esri.dynamicMapLayer({
                        url: layerOptions.url
                    });
                    break;
                case 'ESRITILEMAPLAYER': //arcgis mapserver 服务
                    layer = L.esri.tiledMapLayer({
                        url: layerOptions.url,
                        continuousWorld: false
                    });
                    break;
                case 'ESRITILELAYER': //arcgis 本地缓存切片
                    layer = new esriTileLayer(layerOptions.url, {
                        maxZoom: 22
                    });
                    break;
                case 'GAODETILELAYER': //高德服务

                    layer = new L.tileLayer(layerOptions.url, {
                        maxZoom: layerOptions.maxZoom == undefined ? 20 : layerOptions.maxZoom,
                        minZoom: layerOptions.minZoom == undefined ? 1 : layerOptions.minZoom,
                        subdomains: layerOptions.subdomains || ['1', '2', '3', '4']
                    });
                    break;
                default:
                    console.log('不支持该图层类型！');
                    break;
            }

            if (layer != null) {
                this.map.addLayer(layer);
            }

            return {
                layer: layer
            };
        };

        /**
         * zmap 类的设置中心点和缩放等级函数
         * @param {aarray} center  地图中心坐标
         * @param {number} zoom  缩放等级
         */
        z.zmap.prototype.setView = function (center, zoom) {
            this.map.setView(center, zoom);
        };
        /**
         * zmap 类的设置缩放等级
         * @param {number} zoom 缩放等级
         */
        z.zmap.prototype.setZoom = function (zoom) {
            this.map.setZoom(zoom);
        };
        /**
         * zmap 类的获取地图等级
         * @returns {Number} 地图等级
         */
        z.zmap.prototype.getZoom = function () {
            return this.map.getZoom()
        };
        /**
         * zmap 类的移动到指定坐标函数
         * @param {array}latlng 指定坐标位置
         */
        z.zmap.prototype.panTo = function (latlng) {
            this.map.panTo(latlng);
        };
        /**
         * 地图放大一层级
         */
        z.zmap.prototype.zoomIn = function () {
            this.map.zoomIn();
        };
        /**
         * 地图缩小一层级
         */
        z.zmap.prototype.zoomOut = function () {
            this.map.zoomOut();
        };
        /**
         * zmap 类的设置地图最大缩放等级函数
         * @param {number} zoom 地图最大缩放等级函数
         */
        z.zmap.prototype.setMaxZoom = function (zoom) {
            this.map.setMaxZoom(zoom);
        };
        /**
         * zmap 类的设置地图最小缩放等级函数
         * @param {number} zoom  地图最小缩放等级函
         */
        z.zmap.prototype.setMinZoom = function (zoom) {
            this.map.setMinZoom(zoom);
        };
        /**
         * zmap 类的添加图层函数
         * @param {object} layer featureLayer对象
         */
        z.zmap.prototype.addLayer = function (layer) {
            layer.layer.addTo(this.map);
        };
        /**
         * zmap 类删除图层函数
         * @param {object} layer featureLayer对象
         */
        z.zmap.prototype.removeLayer = function (layer) {
            this.map.removeLayer(layer.layer);
        };
        /**
         * zmap 类的添加监听事件函数
         * @param {string}type 事件类型，'load','zoom','resize','zoomend','move','moveend','click','dblclick','mouseup','mousedown','mousemove','moveover','mouseout'
         * @param {Function}fn 回调函数
         * @returns {string} 事件key值
         */
        z.zmap.prototype.addEvent = function (type, fn) {
            let keys = Object.keys(this.eventFunction);
            let objLen = keys.length;
            let eventKey = 'map_event_' + type + objLen;
            // let self=this;
            this.map.on(type, this.eventFunction[eventKey] = function (evt) {
                fn(evt);

            });
            return eventKey;
        };

        /**
         * zmap 类的移除事件监听函数
         * @param {string} type 事件类型
         * @param {string} eventKey 事件key值
         */
        z.zmap.prototype.removeEvent = function (type, eventKey) {
            if (!eventKey) {
                for (let a in this.eventFunction) {
                    if (a.indexOf(type) != -1) {
                        this.map.off(type, this.eventFunction[a]);
                    }
                }
            } else {
                if (this.eventFunction[eventKey]) {
                    this.map.off(type, this.eventFunction[eventKey]);
                }
            }
        };

        /**
         * zmap 类的添加feature函数
         * @param {object} feature  zmap矢量类型
         */
        z.zmap.prototype.addFeature = function (feature) {
            feature.layer.addTo(this.map);
        };
        /**
         * zmap 类的删除feature函数
         * @param {object} feature zmap中的矢量类型
         */
        z.zmap.prototype.removeFeature = function (feature) {
            feature.layer.remove();
        };
        /**
         * zmap 类的获取地图中心函数
         * @returns {object} 地图中心坐标
         */
        z.zmap.prototype.getCenter = function () {
            return this.map.getCenter();
        };
        /**
         * zmap 类的获取地图范围函数函数
         * @returns {object} 例：{{northEast: *, southEast: *}}
         */
        z.zmap.prototype.getBounds = function () {
            let bounds = this.map.getBounds();
            return {
                northEast: bounds._northEast,
                southWest: bounds._southWest
            }
        };
        /**
         * zmap 类的像素坐标转地理坐标函数
         * @param {object}point 例：[200,300]，相对于原点的坐标
         * @returns {object} latlng 地理坐标
         */
        z.zmap.prototype.layerPointToLatLng = function (point) {
            return this.map.layerPointToLatLng(point);
        };
        /**
         * zmap 类的地理坐标转像素坐标函数
         * @param {array} latLng 例:[33,120]，经纬度坐标
         * @returns {object} 像素坐标
         */
        z.zmap.prototype.latLngToLayerPoint = function (latLng) {
            return this.map.latLngToLayerPoint(latLng);
        };
        /**
         * zmap 类的获取地图当前像素分辨率函数，即每像素对应多少米
         * @returns {number}  单位：米/像素
         */
        z.zmap.prototype.getResolution = function () {
            let bound = this.map.getBounds();
            let dlat = bound._northEast.lat - bound._southWest.lat; //纬度差值
            let dy = this.map.getSize().y; //地图高度，像素
            let long = 40008.6 * 1000 * dlat / 360; //经线弧长对应的实际长度，米
            return long / dy; //每个像素的长度
        };
        /**
         * zmap 类的获取以地图中心为中心函数，宽为width，高height的矩形边界
         * @param {number} width 像素宽，px
         * @param {number} height 像素高，px
         * @returns {object}  矩形的地图范围坐标
         */
        z.zmap.prototype.getRectangleBouds = function (width, height) {
            let center = this.getCenter();
            let centerPiexl = this.map.latLngToLayerPoint(center);

            let leftDown = [centerPiexl.x - width / 2, centerPiexl.y + height / 2];
            let rightTop = [centerPiexl.x + width / 2, centerPiexl.y - height / 2];

            let southWest = this.map.layerPointToLatLng(leftDown);
            let northEast = this.map.layerPointToLatLng(rightTop);
            return {
                southWest: southWest,
                northEast: northEast
            };
        };

        /**
         * 地图定位到某一范围
         * @param {array[]} bounds 范围[[minlat,minlng],[maxlat,maxlng]]
         */
        z.zmap.prototype.fitBounds = function (bounds) {
            this.map.fitBounds(bounds);
        }

        //z.zmap = zmap;
    })(Z);

    (function (z) {
        /**
         * featureLayer 类
		 * @class
         * @param {array} layerAry 图层数组,例：[feature1，feature2,...]
         * @param {object} attributes  图层属性
         */
        z.featureLayer=function(featureAry, attributes) {
            this.eventFunction = {};
            this.layer = L.featureGroup(featureAry);
            this.layerType = 'featureLayer';
            this.layerName = '';
            if (attributes) {
                this.layer.attributes = attributes;
                this.layerName = attributes.layerName || '';
            }
            let self = this;
            this.layer.on('mousemove click', function (evt) {
                let str = evt.type + 'FeatureLayer';
                storeOperateInfo(str, {
                    latlng: evt.latlng,
                    layerName: self.layerName,
                    featureAttr: evt.layer.attributes || {}
                });
            })
        }
        /**
         * featureLayer 添加到map
         * @param {object} map map对象
         */
        z.featureLayer.prototype.addTo = function (map) {
            this.layer.addTo(map.map);
        };
        /**
         * featureLayer 从map中删除
         */
        z.featureLayer.prototype.remove = function () {
            this.layer.remove();
        };
        /**
         * featureLayer 类的添加features函数
         * @param {array} features  例：[layer1，layer2,...]
         */
        z.featureLayer.prototype.addFeature = function (features) {
            let type = Object.prototype.toString.call(features);
            if (type == '[object Array]') {
                for (let i = 0, len = features.length; i < len; i++) {
                    this.layer.addLayer(features[i].layer);
                }
            } else {
                this.layer.addLayer(features.layer);
            }

        };
        /**
         * featureLayer 类的删除features函数
         * @param {object}feature  例：[layer1，layer2,...]
         */
        z.featureLayer.prototype.removeFeature = function (feature) {
            this.layer.removeLayer(feature.layer);
        };
        /**
         * featureLayer 类的删除所有features函数
         */
        z.featureLayer.prototype.clearFeature = function () {
            this.layer.clearLayers();
        };
        /**
         * 设置图层顺序
         * @param {number} ZIndex 图层顺序值
         */
        z.featureLayer.prototype.setZIndex = function (ZIndex) {
            this.layer.setZIndex(ZIndex);
        };
        /**
         * 获取图层顺序
         * @returns {number} 图层顺序值
         */
        z.featureLayer.prototype.getZIndex = function () {
            return this.layer.getZIndex();
        };
        /**
         * featureLayer 类的添加事件函数
         * @param {string}type 事件类型 'click','dblclick','moveover'
         * @param {Function} fn 回调函数
         * @returns {string} 事件key值
         */
        z.featureLayer.prototype.addEvent = function (type, fn) {

            let keys = Object.keys(this.eventFunction);
            let objLen = keys.length;
            let eventKey = 'layer_event_' + type + objLen;
            this.layer.on(type, this.eventFunction[eventKey] = function (evt) {
                fn(evt);
            });
            return eventKey;
        };
        /**
         * featureLayer 类的移除事件函数
         * @param {string} type 事件类型
         * @param {string} eventKey 添加事件时返回的事件key值，eventKey为空则不执行
         */
        z.featureLayer.prototype.removeEvent = function (type, eventKey) {

            if (!eventKey) {
                for (let a in this.eventFunction) {
                    if (a.indexOf(type) != -1) {
                        this.layer.off(type, this.eventFunction[a]);
                    }
                }
            } else {
                if (this.eventFunction[eventKey]) {
                    this.layer.off(type, this.eventFunction[eventKey]);
                }

            }

        };
        /**
         * 获取图层范围函数
         * @returns {array} 范围坐标 [[minlat,minlng],[maxlat,maxlng]]
         */
        z.featureLayer.prototype.getBounds = function () {
            return this.layer.getBounds();
        }
        //z.featureLayer = featureLayer;
    })(Z);

    (function (z) {
        /**
         * circleMarker 类
		 * @class
         * @param {array} coords  坐标点位，例：[32,120]
         * @param {object} options  参数
         *  @param {number} options.radius  像素大小
         *  @param {number}options.opacity 透明度
         *  @param {string}options.color 外边线颜色
         *  @param {number}options.weight 外边线粗细
         *  @param {boolean}options.stroke 是否显示外边框
         *  @param {string}options.fillColor 填充色 rgb或16进制
         *  @param {number}options.fillOpacity 填充透明度
         * @param {number}attributes 属性信息
         */
        z.circleMarker=function(coords, options, attributes) {

            let moptions = options || {};

            let opt = {};
            opt.radius = moptions.radius == undefined ? 10 : moptions.radius; //px
            opt.opacity = moptions.opacity == undefined ? 1.0 : moptions.opacity;
            opt.color = moptions.color || '#3388ff';
            opt.weight = moptions.weight == undefined ? 1 : moptions.weight;
            opt.stroke = moptions.stroke || true;
            opt.fillColor = moptions.fillColor || opt.color;
            opt.fillOpacity = moptions.fillOpacity == undefined ? 0.2 : moptions.fillOpacity;

            this.layer = L.circleMarker(coords, opt);

            if (attributes) {
                this.layer.attributes = attributes;
            }
        }

        z.circleMarker.prototype = {
            /**
             * 绑定popup函数
             * @param  {object} popup z.popup或html
             */
            bindPopup: function (popup,options) {
                this.layer.bindPopup(popup.popup || popup,options);
            },
            /**
             * 解除绑定popup函数
             */
            unbindPopup: function () {
                this.layer.unbindPopup();
            },
            /**
             * 打开popup函数
             * @param {array} latlng 在latlng坐标处打开popup
             */
            openPopup: function (latlng) {
                this.layer.openPopup(latlng);
            },
            /**
             * 关闭popup函数
             */
            closePopup: function () {
                this.layer.closePopup();
            },
            /**
             * 绑定tooltip函数
             * @param {*} content Tooltip内容：String|HTMLElement|Function|Tooltip
             */
            bindTooltip: function (content,) {
                this.layer.bindTooltip(content.popup || content,options);
            },
            /**
             * 解除绑定tooltip函数
             */
            unbindTooltip: function () {
                this.layer.unbindTooltip();
            },
            /**
             * 打开tooltip函数
             * @param {array} latlng 在latlng坐标处打开Tooltip
             */
            openTooltip: function (latlng) {
                this.layer.openTooltip(latlng);
            },
            /**
             * 关闭tooltip函数
             */
            closeTooltip: function () {
                this.layer.closeTooltip();
            },
            /**
             * 切换Tooltip开关状态
             */
            toggleTooltip: function () {
                this.layer.toggleTooltip();
            },
            /**
             * 设置Tooltip内容
             * @param {*} content String|HTMLElement|Tooltip
             */
            setTooltipContent: function (content) {
                this.layer.setTooltipContent(content.tooltip || content);
            },
            /**
             * 添加到map
             * @param {object} map map对象
             */
            addTo: function (map) {
                this.layer.addTo(map.map);
            },
            /**
             * 从map删除circleMarker对象
             */
            remove: function () {
                this.layer.remove();
            },
            /**
             * 返回坐标
             * @returns {array}  经纬度 
             */
            getLatLng: function () {
                return this.layer.getLatLng();
            },
            /**
             * 设置坐标位置
             * @param {array} latlng 经纬度 [32,120]
             */
            setLatLng: function (latlng) {
                this.layer.setLatLng(latlng);
            }
        };

        //z.circleMarker = circleMarker;
    })(Z);

    (function (z) {
        /**
         * marker 类
		 * @class
         * @param {array} coords  坐标点位，例：[32,120]
         * @param {object} options  参数
         * @param {String}options.icon 图标路径
         * @param {number}options.iconSize 图标大小，px
         * @param {array}options.popupAnchor 信息窗位置偏移
         * @param {array}options.iconAnchor 图标偏移
         * @param {string}options.className css类名
         * @param {html}options.html html内容
         * @param attributes {object} 属性信息
         */
        z.marker=function(coords, options, attributes) {

            let moptions = options || {};

            let opt = {};
            opt.opacity = moptions.opacity == undefined ? 1.0 : moptions.opacity;
            opt.title = moptions.title || '';

            let iconOpt = {};
            iconOpt.html = moptions.html || '';
            iconOpt.iconUrl = moptions.icon || null;
            iconOpt.iconSize = moptions.iconSize || [30, 30];
            iconOpt.popupAnchor = moptions.popupAnchor || [0, 0];
            iconOpt.className = moptions.className || '';
            iconOpt.iconAnchor = moptions.iconAnchor || null;

            let myIcon = null;
            if (moptions.type == 'icon'||!moptions.type) {
                myIcon = L.icon(iconOpt);
            } else if (moptions.type == 'divIcon') {
                myIcon = L.divIcon(iconOpt);
            }
            opt.icon = myIcon;
            this.layer = L.marker(coords, opt);
            this.iconOpt = iconOpt;
            if (attributes) {
                this.layer.attributes = attributes;
            }
        }

        z.marker.prototype = {
            /**
             * 绑定popup函数
             * @param {object} popup z.popup或html
             */
            bindPopup: function (popup,options) {
                this.layer.bindPopup(popup.popup || popup,options);
            },
            /**
             * 解除绑定popup函数
             */
            unbindPopup: function () {
                this.layer.unbindPopup();
            },
            /**
             * 打开popup函数
             * @param {array} latlng popup坐标
             */
            openPopup: function (latlng) {
                this.layer.openPopup(latlng);
            },
            /**
             * 关闭popup函数
             */
            closePopup: function () {
                this.layer.closePopup();
            },
            /**
             * 绑定tooltip函数
             * @param {*} content String|HTMLElement|Function|Tooltip
             */
            bindTooltip: function (content,options) {
                this.layer.bindTooltip(content.popup || content,options);
            },
            /**
             * 解除绑定tooltip函数
             */
            unbindTooltip: function () {
                this.layer.unbindTooltip();
            },
            /**
             * 打开tooltip函数
             * @param {array} latlng 在latlng坐标处打开popup
             */
            openTooltip: function (latlng) {
                this.layer.openTooltip(latlng);
            },
            /**
             * 关闭tooltip函数
             */
            closeTooltip: function () {
                this.layer.closeTooltip();
            },
            /**
             * 切换Tooltip开关状态
             */
            toggleTooltip: function () {
                this.layer.toggleTooltip();
            },
            /**
             * 设置Tooltip内容
             * @param {*} content String|HTMLElement|Tooltip
             */
            setTooltipContent: function (content) {
                this.layer.setTooltipContent(content.tooltip || content);
            },
            /**
             * 添加到map
             * @param {object} map map对象
             */
            addTo: function (map) {
                this.layer.addTo(map.map);
            },
            /**
             * 从map删除polyline对象
             */
            remove: function () {
                this.layer.remove();
            },
            /**
             * 返回坐标
             * @returns {object} 点的坐标
             */
            getLatLng: function () {
                return this.layer.getLatLng();
            },
            /**
             * 设置坐标位置
             * @param {array} latlng 点坐标值
             */
            setLatLng: function (latlng) {
                this.layer.setLatLng(latlng);
            },
            /**
             * 更换图标
             * @param {string} icon 图标地址
             */
            setIcon: function (icon) {
                this.iconOpt.iconUrl = icon;
                let myIcon = L.icon(this.iconOpt);
                this.layer.setIcon(myIcon);
            },
            /**
             * 更换div图标
             * @param {string} html 图标html内容
             */
            setDivIcon: function (html) {
                this.iconOpt.html = html;
                let myIcon = L.divIcon(this.iconOpt);
                this.layer.setIcon(myIcon);
            }
        };
        //z.marker = marker;
    })(Z);

    (function (z) {
        /**
         * 矢量切片加载方法
		 * @class
         * @param {string} url 切片服务地址 
         * @param {object} options
         * @param {object} options.renderFactory 可选：L.svg.tile或L.canvas.tile，默认L.svg.tile
         * @param {object} options.vectorTileLayerStyles 切片样式
         * @returns {object} 返回矢量切片图层
         */
        z.vectorGridLayer = function (url, options) {
            let layerOptions = options || {};
            let vectorTileLayerStyles = {};
            // vectorTileLayerStyles[layerOptions.layerName] = function (feature, zoom) {
            //     let weight = 0;
            //     let roadclass = feature.NROADCLASS;
            //     if (zoom <= 12) {
            //         if (roadclass == '41000' || roadclass == '42000' || roadclass == '43000') {
            //             weight = 1;
            //         } else {
            //             weight = 0;
            //         }
            //     } else if (zoom < 15 && zoom > 12) {
            //         if (roadclass == '41000' || roadclass == '42000' || roadclass == '43000' || roadclass == '44000') {
            //             weight = 2;
            //         } else {
            //             weight = 0;
            //         }
            //     } else {
            //         weight = 2;
            //     }

            //     let color = feature.COLOR;
            //     let lineColor = '';
            //     if (color == '1') {
            //         lineColor = '#34b000';
            //     } else if (color == '2') {
            //         lineColor = '#fecb00';
            //     } else if (color == '3') {
            //         lineColor = '#df0100';
            //     } else {
            //         lineColor = '#8e0e0b';
            //     }
            //     return {
            //         weight: weight,
            //         color: lineColor || '#34b000'
            //     }
            // }
            layerOptions.renderFactory = layerOptions.renderFactory ? layerOptions.renderFactory : L.svg.tile;
            vectorTileLayerStyles[layerOptions.layerName] = options.vectorTileLayerStyles;
            layerOptions.vectorTileLayerStyles = vectorTileLayerStyles;
            let layer = L.vectorGrid.protobuf(url, layerOptions);
            return {
                layer: layer
            };
        };

        z.vectorGridLayer.prototype = {};
        //z.vectorGridLayer = vectorGrid;
    })(Z);

    (function (z) {
        /**
         * polyline 类，根据一系列坐标生成折线
		 * @class
         * @param coordsAry {array} 坐标点位二位数组，例：[[32,120],[32,121],[32,122],...]
         * @param options {object} 参数
         * @param options.color 折线颜色
         * @param options.weight 折线粗细
         * @param attributes 属性信息
         */
        z.polyline=function(coordsAry, options, attributes) {
            let moptions = options || {};

            let opt = {};
            opt.color = moptions.color || '#3388ff';
            opt.opacity = moptions.opacity || 1;
            opt.weight = moptions.weight == undefined ? 3 : moptions.weight;

            this.layer = L.polyline(coordsAry, moptions);
            if (attributes) {
                this.layer.attributes = attributes;
            }
        }
        z.polyline.prototype = {
            /**
             * 获取polyline范围
             */
            getBounds: function () {
                return this.layer.getBounds();
            },
            /**
             * 绑定popup函数
             * @param {object} popup z.popup或html
             */
            bindPopup: function (popup,options) {
                this.layer.bindPopup(popup.popup || popup,options);
            },
            /**
             * 解除绑定popup函数
             */
            unbindPopup: function () {
                this.layer.unbindPopup();
            },
            /**
             * 打开popup函数
             * @param {array} latlng 在latlng坐标处打开popup
             */
            openPopup: function (latlng) {
                this.layer.openPopup(latlng);
            },
            /**
             * 关闭popup函数
             */
            closePopup: function () {
                this.layer.closePopup();
            },
            /**
             * 绑定tooltip函数
             * @param {*} content String|HTMLElement|Function|Tooltip
             */
            bindTooltip: function (content,options) {
                this.layer.bindTooltip(content.popup || content,options);
            },
            /**
             * 解除绑定tooltip函数
             */
            unbindTooltip: function () {
                this.layer.unbindTooltip();
            },
            /**
             * 打开tooltip函数
             * @param {array} latlng 在latlng处打开tooltip
             */
            openTooltip: function (latlng) {
                this.layer.openTooltip(latlng);
            },
            /**
             * 关闭tooltip函数
             */
            closeTooltip: function () {
                this.layer.closeTooltip();
            },
            /**
             * 切换Tooltip开关状态
             */
            toggleTooltip: function () {
                this.layer.toggleTooltip();
            },
            /**
             * 设置Tooltip内容
             * @param {*} content String|HTMLElement|Tooltip
             */
            setTooltipContent: function (content) {
                this.layer.setTooltipContent(content.tooltip || content);
            },
            /**
             * 添加到map
             * @param {object} map map对象
             */
            addTo: function (map) {
                this.layer.addTo(map.map);
            },
            /**
             * 从map删除polyline对象
             */
            remove: function () {
                this.layer.remove();
            },
            /**
             * 返回坐标
             * @returns {array[]} 二维数组
             */
            getLatLngs: function () {
                return this.layer.getLatLngs();
            },
            /**
             * 设置样式
             * @param {object} options  参数
             * @param {string} options.color 折线颜色,rgb转16进制
             * @param {number} options.weight 折线粗细
             */
            setStyle: function (options) {
                this.layer.setStyle(options);
            },
            /**
             * 设置坐标位置
             * @param {array[]} latlng 经纬度 [[32,120],[32,121],[32,122],...]
             */
            setLatLngs: function (latlng) {
                this.layer.setLatLngs(latlng);
            }
        };
        //z.polyline = polyline;
    })(Z);

    (function (z) {
        /**
         * polygon 类，根据一系列首位相接的坐标生成多边形
		 * @class
         * @param {array} coordsAry  坐标点位二位数组，首尾坐标相同例：[[32,120],[32,121],[32,122],...[32,120]}
         * @param {object} options  参数
         *  @param {boolean} options.stroke 是否显示外边线
         *  @param {string} options.color 外边线颜色，rgb或16进制
         *  @param {number} options.weight 外边线粗细，默认3
         *  @param {string} options.fillColor 填充色，rgb或16进制
         *  @param {number} options.fillOpacity 填充透明度
         * @param {onject} attributes 属性信息
         */
        z.polygon=function(coordsAry, options, attributes) {
            let moptions = options || {};

            let opt = {};
            opt.color = moptions.color || '#3388ff';
            opt.weight = moptions.weight == undefined ? 3 : moptions.weight;
            opt.stroke = moptions.stroke || true;
            opt.fillColor = moptions.fillColor || moptions.color;
            opt.fillOpacity = moptions.fillOpacity == undefined ? 0.2 : moptions.fillOpacity;

            this.layer = L.polygon(coordsAry, moptions);
            if (attributes) {
                this.layer.attributes = attributes;
            }
        }
        z.polygon.prototype = {
            /**
             * 获取polygon范围
             */
            getBounds: function () {
                return this.layer.getBounds();
            },
            /**
             * 绑定popup函数
             * @param {object} popup z.popup或html
             */
            bindPopup: function (popup,options) {
                this.layer.bindPopup(popup.popup || popup,options);
            },
            /**
             * 解除绑定popup函数
             */
            unbindPopup: function () {
                this.layer.unbindPopup();
            },
            /**
             * 打开popup函数
             * @param {array} latlng 在latlng处打开Popup
             */
            openPopup: function (latlng) {
                this.layer.openPopup(latlng);
            },
            /**
             * 关闭popup函数
             */
            closePopup: function () {
                this.layer.closePopup();
            },
            /**
             * 绑定tooltip函数
             * @param {*} content String|HTMLElement|Function|Tooltip
             */
            bindTooltip: function (content,options) {
                this.layer.bindTooltip(content.popup || content,options);
            },
            /**
             * 解除绑定tooltip函数
             */
            unbindTooltip: function () {
                this.layer.unbindTooltip();
            },
            /**
             * 打开tooltip函数
             * @param {array} latlng 在latlng处打开tooltip
             */
            openTooltip: function (latlng) {
                this.layer.openTooltip(latlng);
            },
            /**
             * 关闭tooltip函数
             */
            closeTooltip: function () {
                this.layer.closeTooltip();
            },
            /**
             * 切换Tooltip开关状态
             */
            toggleTooltip: function () {
                this.layer.toggleTooltip();
            },
            /**
             * 设置Tooltip内容
             * @param {*} content String|HTMLElement|Tooltip
             */
            setTooltipContent: function (content) {
                this.layer.setTooltipContent(content.tooltip || content);
            },
            /**
             * 添加到map
             * @param {object} map map对象
             */
            addTo: function (map) {
                this.layer.addTo(map.map);
            },
            /**
             * 从map删除polyline对象
             */
            remove: function () {
                this.layer.remove();
            },
            /**
             * 返回坐标
             * @returns {array[]} 二维数组
             */
            getLatLngs: function () {
                return this.layer.getLatLngs();
            },
            /**
             * 设置样式
             * @param {object} options  参数
             *  @param {boolean} options.stroke 是否显示外边线
             *  @param {string} options.color 外边线颜色，rgb或16进制
             *  @param {number} options.weight 外边线粗细，默认3
             *  @param {string} options.fillColor 填充色，rgb或16进制
             *  @param {number} options.fillOpacity 填充透明度
             */
            setStyle: function (options) {
                this.layer.setStyle(options);
            },
            /**
             * 设置坐标位置
             * @param {array[]} latlng 经纬度 [[32,120],[32,121],[32,122],...]
             */
            setLatLngs: function (latlng) {
                this.layer.setLatLngs(latlng);
            }
        };
        //z.polygon = polygon;
    })(Z);

    (function (z) {
        /**
         * popup 类
		 * @class
         * @param {L.feature} feature
         * @param {object} options 参数
         * @param {number} options.maxWidth 最大宽度，默认300px;
         * @param {number} options.minWidth 最小宽度，默认50px，
         * @param {boolean} options.autoPan 是否跟随地图拖动,默认true
         * @param {boolean} options.closeButton 是否显示关闭按钮,默认true
         * @param {boolean} options.autoClose 是否自动关闭，默认false
		 * @param {string} options.className 名称
         * @param attributes {object} 属性信息
         */
        z.popup=function(options) {
            let moptions = options || {};

            let opt = {};
            opt.maxWidth = moptions.maxWidth == undefined ? 300 : moptions.maxWidth;
            opt.minWidth = moptions.minWidth == undefined ? 50 : moptions.minWidth;
            opt.autoPan = moptions.autoPan || true;
            opt.closeButton = moptions.closeButton || true;
            opt.className = moptions.className || '';
            opt.autoClose = moptions.autoClose || false;

            this.popup = L.popup(opt);

            if (moptions.attributes) {
                this.popup.attributes = moptions.attributes;
            }
        }
        z.popup.prototype = {
            /**
             * 返回popup坐标
             * @returns {object}
             */
            getLatLng: function () {
                return this.popup.getLatLng();
            },
            /**
             * 设置坐标位置
             * @param {array} latlng 坐标值
             */
            setLatLng: function (latlng) {
                this.popup.setLatLng(latlng);
            },
            /**
             * 获取popup内容
             * @returns {html}
             */
            getContent: function () {
                return this.popup.getContent();
            },
            /**
             * 设置popup内容
             * @param {html} html html内容
             */
            setContent: function (html) {
                this.popup.setContent(html);
            },
            /**
             * 返回popup打开状态
             * @returns {boolean}
             */
            isOpen: function () {
                return this.popup.isOpen();
            },
            /**
             * 更新显示
             */
            update: function () {
                this.popup.update();
            },
            /**
             * 添加到map
             * @param {object} map map对象
             */
            addTo: function (map) {
                this.popup.addTo(map.map || map.layer);
            },
            /**
             * 从map 中移除
             */
            remove: function () {
                this.popup.remove();
            }
        };
        /**
         * tooltip 类
		 * @class
         * @param options
		 * @param options.sticky {boolean} 默认false toolTip位置固定或跟随鼠标移动，默认false 固定
		 * @param options.permanent {boolean} 永久显示或鼠标触碰显示，默认false 鼠标触碰显示
		 * @param options.offset {array} 默认[0, 0]
		 * @param options.interactive {boolean} 是否监听feature 事件，默认false
		 * @param options.direction {string} 打开tooltip的方向，可选值right, left, top, bottom, center, auto。默认auto
         */
        z.tooltip=function(options) {
            let moptions = options || {};

            let opt = {};
            opt.sticky = moptions.sticky || false;
            opt.permanent = moptions.minWidth || false;
            //opt.pane = moptions.pane || 'tooltipPane';
            opt.interactive = moptions.interactive || false;
            opt.offset = moptions.offset || [0, 0];
            opt.direction = moptions.direction || 'auto';

            this.tooltip = L.tooltip(opt);

            if (moptions.attributes) {
                this.popup.attributes = moptions.attributes;
            }
        }
        z.tooltip.prototype = {

            /**
             * 获取tooltip内容
             * @returns {object}
             */
            getPane: function () {
                return this.popup.getPane();
            },

            /**
             * 添加到map
             * @param {object} map map 对象
             */
            addTo: function (map) {
                this.popup.addTo(map.map || map.layer);
            },
            /**
             * 从map 中移除
             */
            remove: function () {
                this.popup.remove();
            }
        };
        //z.popup = popup;
        //z.tooltip = tooltip;
    })(Z);

    (function (z) {
        /**
         * wfs查询
		 * @class
         * @param {string} serviceUrl 服务地址
         * @param {object} options 参数
		 * @param {string} options.layerName 图层名，
		 * @param {string} options.field 查询字段，
		 * @param {object} options.geometry 'polygon'或'circle' 
		 * @param {string} options.coordString 坐标，
		 * @param {number} options.radius 半径
         * @param {function}fn 查询结果回调
         * @param {function}error 返回错误信息
         */
        z.wfsQuery = function (serviceUrl, options, fn, error) {
            let wfsOptions = options || {};

            let url = serviceUrl + 'service=WFS&request=GetFeature&version=1.0.0&maxFeatures=200&typeName=' + wfsOptions.layerName + '&outputFormat=json&Filter=';

            let param = '<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">';
            param = param + '<Intersects>';
            param = param + '<PropertyName>' + wfsOptions.field + '</PropertyName>';
            param = param + '<gml:polygon><gml:outerBoundaryIs><gml:LinearRing>';
            if (wfsOptions.geometry == 'polygon') {
                param = param + '<gml:coordinates>' + wfsOptions.coordString + '</gml:coordinates>';
            } else if (wfsOptions.geometry == 'circle') {
                let coordString = getCircleRing(wfsOptions.coordString, wfsOptions.radius);
                param = param + '<gml:coordinates>' + coordString + '</gml:coordinates>';
            }
            param = param + '</gml:LinearRing></gml:outerBoundaryIs></gml:polygon>';
            param = param + '</Intersects>';
            param = param + '</Filter>';

            $.ajax({
                type: 'POST',
                contentType: 'text/plain;charset=UTF-8',
                async: true,
                url: url + param,
                // data:param,
                // dataType:'json',
                success: function (data) {
                    fn(data);
                },
                error: function (e) {
                    error(e);
                }
            });
        }
		/**
         * wfs查询
		 * @class Z.vectorTileClick
         * @param {string}serviceUrl 服务地址
         * @param {object}options 参数
		 * @param {string} options.layerName 图层名，
		 * @param {string} options.field 查询字段，
		 * @param {object} options.geometry 'polygon'或'circle' 
		 * @param {string} options.coordString 坐标，
		 * @param {number} options.radius 半径
         * @param {function}fn 查询结果回调
         * @param {function}error 返回错误信息
         */
        z.vectorTileClick=function(serviceUrl, options, fn, error){
            z.wfsQuery(serviceUrl, options, function(data){
                if (data.features && data.features.length > 0) {//features为查询的路段
                    let feature = data.features[0];
                    let properties = feature.properties;
                    let str = 'clickFeatureLayer';
                    let pointary = options.coordString.split(',');
                    storeOperateInfo(str, {
                        latlng: {lat:pointary[0],lng:pointary[1]},
                        layerName: options.layerName,
                        featureAttr: properties || {}
                    });
                    fn(data.features[0]);
                }else{
                    fn(null);
                }
            }, function(e){error(e)})
        }

        //z.wfsQuery = wfsQuery;
        //z.vectorTileClick = vectorTileClick;
    })(Z);

    (function(z){
        /**
         * featureLayerWithMap图层，可以控制图层显隐，设置图层显示的等级，以及图片和矢量点的切换
         * @class
         * @extends {featureLayer}
         * @param {object} map map对象
         * @param {array} dataList 图层数据
         * @param {string} featureType 要素类型
         * @param {object} options 样式、显隐等
         */
        z.featureLayerWithMap=function(map,dataList,featureType,options,attributes){
            let type = Object.prototype.toString.call(dataList);
            if (type == '[object Array]') {
                this._alldata=dataList;
            }else if(type == '[object String]'){
                this._alldata=this._getData(dataList)||[];
            }
            this._map=map;
            this._style=options||{};
            this._featureType0=featureType;
            this._featureType=featureType;
            this._eventKey=null;
            this._tempColor=null;
            this._layerName=options.options||''

            if(this._style.visible==false){
                this._visible=false;
            }else{
                this._visible=true;
            }
            if(this._style.startZoom){
                this._startZoom=options.startZoom;
            }else{
                this._startZoom=0;
            }
            if(this._style.showLittlePoint){
                this._showLittlePoint=true;
            }
            this._layer=new Z.featureLayer();
            this.layer=this._layer.layer;
            this.layer.attributes=attributes||{};
            if(this._visible){
                this._map.addLayer({layer:this.layer})
            }
            this._lastzoom = this._map.getZoom();
            if(this._lastzoom>=this._startZoom){
                this._addCurExtentFeatureToLayer();
            }else{
                if((this._featureType0=='marker'||this._featureType0=='circlemarker')&&this._showLittlePoint){
                    this._featureType='circlemarker';
                    this._addCurExtentFeatureToLayer();
                }
            }
            this._addMoveEvent();
            
            //继承featureLayer的方法
            for(var p in this._layer){
                z.featureLayerWithMap.prototype[p]=this._layer[p]
            }
            
        }
        z.featureLayerWithMap.prototype={

            set visible(visible){
                let isAddLayer=this._map.hasLayer({layer:this.layer});
                if(visible){
                    if(isAddLayer){
                        return;
                    }
                    this._clearLayer();
                    this._addCurExtentFeatureToLayer();
                    this._map.addLayer({layer:this.layer});
                }else{
                    if(isAddLayer){
                        this._map.removeLayer({layer:this.layer});
                    }
                }
                this._visible=visible;
            },
            get visible(){
                return this._visible;
            },

            set startZoom(zoom){
                this._startZoom=zoom;
            },
            get startZoom(){
                return this._startZoom;
            },


            _getBounds:function(){
                let bounds = this._map.getBounds();
                let maxLat = bounds.northEast.lat;
                let minLat = bounds.southWest.lat;
                let maxLng = bounds.northEast.lng;
                let minLng = bounds.southWest.lng;
                return{maxLat:maxLat,minLat:minLat,maxLng:maxLng,minLng}
            },
            _addCurExtentFeatureToLayer:function(){
                let dataList=this._alldata;
                if(null==this._tempColor)
                this._tempColor=getColor();
                for(let i=0,len=dataList.length;i<len;i++){
                    let isInCurExtent=this._isInCurExtent(dataList[i]);
                    isInCurExtent.layerName=this._layerName;
                    if(isInCurExtent){
                        if(this._featureType.toLowerCase()=='marker'){
                            let latlng = [isInCurExtent.lat, isInCurExtent.lng];
                            let marker = new Z.marker(latlng, {
                                icon: this._style.icon,
                                type: 'icon'
                            }, isInCurExtent);
                            this._layer.addFeature(marker);
                        }
                        if(this._featureType.toLowerCase()=='circlemarker'){
                            let latlng = [isInCurExtent.lat, isInCurExtent.lng];
                            let circleMarker = new Z.circleMarker(latlng, {
                                color: this._style.color||this._tempColor,
                                radius:this._style.radius||5,
                                type: 'icon'
                            }, isInCurExtent);
                            this._layer.addFeature(circleMarker);
                        }
                    }
                }
            },
            _isInCurExtent:function(dataListi){
                let extent=this._getBounds();
                if(this._featureType.toLowerCase()=='marker'||this._featureType.toLowerCase()=='circlemarker'){
                    let lat = dataListi.centerLat || dataListi.lat;
                    let lng = dataListi.centerLng || dataListi.lng;
                    if (lat && lng) {
                        if (lat > extent.minLat && lat < extent.maxLat && lng < extent.maxLng && lng > extent.minLng) {
                            dataListi.lat=lat;
                            dataListi.lng=lng;
                            return dataListi;
                        }else{return false}
                    }else{return false}
                }
            },
            _clearLayer:function(){
                this._layer.clearFeature();
            },
            _addMoveEvent:function(){

                //放大，缩小地图隐藏/显示地图图层
                let self=this;
                this._eventKey=this._map.addEvent('moveend', function() {
                    let zoom = self._map.getZoom();
                    if(!self._visible){
                        return;
                    }
                    if(self._lastzoom<=self._startZoom&&zoom<=self._startZoom){
                        self._lastzoom = zoom;
                        //如果不是'marker'或'circlemarker'类型，或者_showLittlePoint=false,则不显示（执行return）
                        if(!self._showLittlePoint||(self._featureType0!='marker'&&self._featureType0!='circlemarker')){
                            return;
                        }
                    }
                    self._clearLayer();
                    self._addCurExtentFeatureToLayer();
                    if (zoom > self._startZoom && self._lastzoom <= self._startZoom) {
                        if((self._featureType0=='marker'||self._featureType0=='circlemarker')&&self._showLittlePoint){
                            self._featureType=self._featureType0;
                            self._clearLayer();
                            self._addCurExtentFeatureToLayer();
                        }else{
                            self._map.addLayer({layer:self.layer});
                        }
                    } else if (zoom <= self._startZoom && self._lastzoom > self._startZoom) {
                        
                        if((self._featureType0=='marker'||self._featureType0=='circlemarker')&&self._showLittlePoint){
                            self._featureType='circlemarker';
                            self._clearLayer();
                            self._addCurExtentFeatureToLayer();
                        }else{
                            self._map.removeLayer({layer:self.layer});
                        }
                    }
                    self._lastzoom = zoom;
                });
            },
            _getData:function(serviceUrl){
                let result;
                $.ajax({
                    type: 'get',
                    async: false,
                    url: serviceUrl, //后台查询服务地址
                    dataType: 'json',
                    success: function (data) {
                        result = data;
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

                return result;
            },
            _stringLatlngToArray:function(str){
                let pointsStr=str;
                //let pointsStr='LINESTRING  ( 121.58346132 29.83323510, 121.58346168 29.83323510, 121.58382204 29.83301973, 121.58383284 29.83301325, 121.58384796 29.83300371, 121.58413668 29.83283145, 121.58437212 29.83269177, 121.58446428 29.83263723)'
                pointsStr=pointsStr.replace('LINESTRING','');
                pointsStr=pointsStr.replace('POLYGON','');
                pointsStr=pointsStr.replace(/\(/g,'').replace(/\)/g,'');//去除所有"(""")"
                let pAry=pointsStr.split(',');
                let linePaths=[];
                for(let j=0;j<pAry.length;j++){
                    pAry[j]=pAry[j].replace(/(^\s*)|(\s*$)/g, '');//去除前后空格
                    pAry[j]=pAry[j].split(' ');
                    let pointAry=[parseFloat(pAry[j][1]),parseFloat(pAry[j][0])];
                    linePaths.push(pointAry);
                }
                return linePaths;
            }




        }



    })(Z);


    (function(z){
        z.addHeatmap=function(map,data,options){
            let opt=options||{};
            this._map=map;
            this._visible=true;
            let type = Object.prototype.toString.call(data);
            if (type == '[object Array]') {
                this._alldata=data;
            }else if(type == '[object String]'){
                this._alldata=this._getData(data)||[];
            }

            this._heatmapData=this._getHeatmapData();

            this._config={
                radius: 0.001,       //设置每一个热力点的半径
                maxOpacity:opt.maxOpacity|| 0.9,        //设置最大的不透明度
                minOpacity:opt.minOpacity|| 0.2,     //设置最小的不透明度
                scaleRadius:opt.scaleRadius||true,      //设置热力点是否平滑过渡
                blur:opt.blur||0.95,             //系数越高，渐变越平滑，默认是0.85,
                                        //滤镜系数将应用于所有热点数据。
                useLocalExtrema:opt.useLocalExtrema||true,  //使用局部极值
                latField: 'lat',   //维度
                lngField: 'lng',  //经度
                valueField: 'count',    //热力点的值
                gradient:opt.gradient|| {   
                        "0.99": "rgba(255,0,0,1)",
                        "0.9": "rgba(255,255,0,1)",
                        "0.8": "rgba(0,255,0,1)",
                        "0.5": "rgba(0,255,255,1)",
                        "0": "rgba(0,0,255,1)"
                    }
            }

            //this.layer = new HeatmapOverlay(this._config);
            this.layer = L.heatLayer(this._heatmapData, {radius: 25});

            this._map.addLayer({layer:this.layer});
            //this.layer.setData({max:8,data:this._heatmapData});

            this.layer.setOptions({
                minOpacity:opt.maxOpacity||1,//热量开始时的最小不透明度 
                maxZoom:opt.maxZoom||20,//点到达最大强度的缩放级别（随着缩放的强度比例），默认等于地图的maxZoom
                max:opt.max||1,//最大点强度，默认为1.0 
                radius:opt.radius||10,//热图的每个“点”的半径，默认为25 
                blur:opt.blur||15,//模糊量，默认为15 
                gradient:opt.gradient||{//颜色渐变配置，例如{0.4：'蓝色'，0.65：'石灰'，1：'红色'}
                    "1": "rgba(255,0,0,1)",
                    "0.9": "rgba(255,255,0,1)",
                    "0.8": "rgba(0,255,0,1)",
                    "0.5": "rgba(0,255,255,1)",
                    "0": "rgba(0,0,255,1)"
                }
            });
            this.layer.redraw();

        }

        z.addHeatmap.prototype={
            set visible(visible){

                let isAddLayer=this._map.hasLayer({layer:this.layer});
                if(visible){
                    if(isAddLayer){
                        return;
                    }
                    this._map.addLayer({layer:this.layer});
                }else{
                    if(isAddLayer){
                        this._map.removeLayer({layer:this.layer});
                    }
                }
                this._visible=visible;
            },
            get visible(){
                return this._visible;
            },

            _getHeatmapData:function(){
                let len=this._alldata.length;
                if(len==0)
                return;
                let reaultAry=[];
                for(let i=0;i<len;i++){

                    let lat = this._alldata[i].centerLat || this._alldata[i].lat;
                    let lng = this._alldata[i].centerLng || this._alldata[i].lng;
                    if (lat && lng) {
                        //reaultAry.push({lat:lat,lng:lng,count:1});
                        reaultAry.push([lat,lng,0.5]);
                    }
                }
                return reaultAry;  
            },
            
            _getData:function(serviceUrl){
                let result;
                $.ajax({
                    type: 'get',
                    async: false,
                    url: serviceUrl, //后台查询服务地址
                    dataType: 'json',
                    success: function (data) {
                        result = data;
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

                return result;
            }
        }
    })(Z);


    (function(z){
        z.addMarkerCluster=function(map,data,options){

            let opt=options||{};
            this._map=map;
            this._visible=true;
            this._icon=opt.icon||null;
            let type = Object.prototype.toString.call(data);
            if (type == '[object Array]') {
                this._alldata=data;
            }else if(type == '[object String]'){
                this._alldata=this._getData(data)||[];
            }

            this.layer = L.markerClusterGroup({
                showCoverageOnHover:opt.showCoverageOnHover||false,
                zoomToBoundsOnClick:opt.zoomToBoundsOnClick||true,
                spiderfyOnMaxZoom:opt.spiderfyOnMaxZoom||false,
                disableClusteringAtZoom:opt.disableClusteringAtZoom||18,
                maxClusterRadius:opt.maxClusterRadius||80,
                animate:opt.animate||true
            });
            this._addDataToLayer();
            this._map.addLayer({layer:this.layer});
        }

        z.addMarkerCluster.prototype={

            _addDataToLayer:function(){
                let len=this._alldata.length;
                if(len==0)
                return;
                for(let i=0;i<len;i++){
                    let lat = this._alldata[i].centerLat || this._alldata[i].lat;
                    let lng = this._alldata[i].centerLng || this._alldata[i].lng;
                    let name=this._alldata[i].interName||this._alldata[i].devcName;
                    if (lat && lng) {
                        this._alldata[i].lat=lat;
                        this._alldata[i].lng=lng;
                        var marker = L.marker(new L.LatLng(lat, lng));
                        marker.attributes=this._alldata[i];
                        marker.bindPopup(name);
                        this.layer.addLayer(marker);
                    }
                }
            },
            _getData:function(serviceUrl){
                let result;
                $.ajax({
                    type: 'get',
                    async: false,
                    url: serviceUrl, //后台查询服务地址
                    dataType: 'json',
                    success: function (data) {
                        result = data;
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
                return result;
            }
        }

    })(Z);


    (function (z) {
        /**
         * 绘制方法
		 * @class
         * @param {object} map map对象
         */
        z.draw = function (map) {
            this._map = map.map;
            this._type = null;
            this._pointAry = [];
            this._container = this._map._container;
            this._tempLayer = null;
            this._currentLayer = null;
            this._layerAry = [];

            this._center = null;
            this._radius = null;


            this.eventElement = {};

        }
        z.draw.prototype = {

            /**
             * 开始绘制，传入绘制类型参数
             * @param {String} type  'circlemarker','polyline','polygon','circle','rectangle'
             * @param {function} fn 回调
             */
            startDraw: function (type, fn) {
                this.stop();
                this._type = type.toLowerCase();

                this._map.doubleClickZoom.disable();

                this.eventElement.mousemove = this._onMove.bind(this);
                this.eventElement.click = this._onClick.bind(this);
                this.eventElement.dblclick = this._onFinish.bind(this, fn);
                this.eventElement.mousedown = this._onmouseDown.bind(this);
                this.eventElement.mouseup = this._onmouseUp.bind(this, fn);

                this._map.on('mousemove', this.eventElement.mousemove);
                this._map.on('click', this.eventElement.click);
                this._container.style.cursor = 'crosshair';

                if (this._type == 'circle' || this._type == 'rectangle') {
                    this._map.on('mousedown', this.eventElement.mousedown);
                    this._map.on('mouseup', this.eventElement.mouseup);
                }
                this._map.on('dblclick', this.eventElement.dblclick);

            },

            _onClick: function (evt) {
                let latlng = evt.latlng;

                if (this._type == 'polyline') {
                    this._pointAry.push(latlng);
                    if (this._pointAry.length > 1) {
                        if (!this._currentLayer) {
                            this._currentLayer = new L.polyline([this._pointAry[0], this._pointAry[1]]);
                            this._currentLayer.addTo(this._map);
                        } else {
                            this._currentLayer.addLatLng(latlng);
                        }

                    }
                } else if (this._type == 'polygon') {
                    this._pointAry.push(latlng);
                    if (this._pointAry.length > 1) {
                        if (!this._currentLayer) {
                            this._currentLayer = new L.polyline([this._pointAry[0], this._pointAry[1]]);
                            this._currentLayer.addTo(this._map);
                        } else {
                            this._currentLayer.addLatLng(latlng);
                        }

                    }
                } else if (this._type == 'point') {
                    this._pointAry.push(latlng);
                    this._currentLayer = new L.circleMarker(latlng);
                    this._currentLayer.addTo(this._map);
                    this._layerAry.push(this._currentLayer);
                    this._currentLayer = null;
                }


            },
            _onmouseDown: function (evt) {
                this._map.dragging.disable();
                this._center = evt.latlng;
                if (this._type == 'circle') {
                    this._currentLayer = L.circle(this._center, {
                        radius: 0
                    });
                    this._currentLayer.addTo(this._map);
                }
                if (this._type == 'rectangle') {
                    this._currentLayer = L.rectangle([this._center, this._center]);
                    this._currentLayer.addTo(this._map);
                }
            },
            _onmouseUp: function (fn) {

                if (this._type == 'circle') {
                    this._pointAry.push({
                        center: this._center,
                        radius: this._radius
                    });
                } else {
                    this._pointAry.push({
                        rectBounds: this._rectBounds
                    });
                }
                let result = {
                    type: this._type,
                    latLngAry: this._pointAry,
                    center: this._center,
                    radius: this._radius,
                    rectBounds: this._rectBounds
                };
                this._layerAry.push(this._currentLayer);
                this._center = null;
                this._currentLayer = null;
                this._map.dragging.enable();
                if (fn) {
                    fn(result);
                }

            },
            _onMove: function (evt) {
                let latlng = evt.latlng;
                if (this._type == 'polyline') {
                    if (this._pointAry.length > 0) {
                        if (this._tempLayer) {
                            this._tempLayer.setLatLngs([this._pointAry[this._pointAry.length - 1], latlng]);
                        } else {
                            this._tempLayer = new L.polyline([this._pointAry[this._pointAry.length - 1], latlng]);
                            this._tempLayer.addTo(this._map);
                        }
                    }

                } else if (this._type == 'polygon') {
                    if (this._pointAry.length > 0) {
                        //与起点
                        if (this._tempLayer) {
                            this._tempLayer.setLatLngs([this._pointAry[0], latlng]);
                        } else {
                            this._tempLayer = new L.polyline([this._pointAry[this._pointAry.length - 1], latlng]);
                            this._tempLayer.addTo(this._map);
                        }
                        //与终点
                        if (this._tempLayer1) {
                            this._tempLayer1.setLatLngs([this._pointAry[this._pointAry.length - 1], latlng]);
                        } else {
                            this._tempLayer1 = new L.polyline([this._pointAry[this._pointAry.length - 1], latlng]);
                            this._tempLayer1.addTo(this._map);
                        }

                    }
                } else if (this._type == 'circle') {

                    if (this._center) {
                        this._radius = L.latLng(latlng).distanceTo(this._center);
                        this._currentLayer.setRadius(this._radius);
                    }

                } else if (this._type == 'rectangle') {

                    if (this._center) {
                        this._rectBounds = [this._center, latlng];
                        this._currentLayer.setBounds(this._rectBounds);
                    }

                }

            },
            _onFinish: function (fn) {

                //返回绘制结果
                let result = {
                    type: this._type,
                    latLngAry: this._pointAry,
                    center: this._center,
                    radius: this._radius
                };


                if (this._tempLayer) {
                    this._tempLayer.remove();
                    this._tempLayer = null;
                }
                if (this._tempLayer1) {
                    this._tempLayer1.remove();
                    this._tempLayer1 = null;
                }
                if (this._type == 'polygon') {
                    if (this._currentLayer) {
                        this._currentLayer.remove();
                        this._currentLayer = null;
                    }

                    this._pointAry.push(this._pointAry[0]);
                    this._currentLayer = new L.polygon(this._pointAry).addTo(this._map);
                    result.latLngAry = this._pointAry;
                }
                if (this._type == 'point') {
                    this._layerAry[this._layerAry.length - 1].remove();
                    this._pointAry.pop();
                }
                if (this._type == 'circle' || this._type == 'rectangle') {
                    this._layerAry[this._layerAry.length - 1].remove();
                    this._pointAry.pop();
                    this._layerAry[this._layerAry.length - 2].remove();
                    this._pointAry.pop();
                }

                this._pointAry = [];

                if (this._currentLayer) {
                    this._layerAry.push(this._currentLayer);
                    this._currentLayer = null;
                }
                if (fn) {
                    fn(result);
                }
            },
            /**
             * 清除绘制结果
             */
            clearResult: function () {
                if (this._layerAry.length > 0) {
                    for (let i = 0; i < this._layerAry.length; i++) {
                        this._layerAry[i].remove();
                    }

                }
            },
            /**
             * 结束本次绘制
             */
            cancel: function () {

                this._pointAry = [];
                this._center = null;
                this._radius = null;

                if (this._currentLayer) {
                    this._currentLayer.remove();
                    this._currentLayer = null;
                }

                if (this._tempLayer) {
                    this._tempLayer.remove();
                    this._tempLayer = null;
                }
                if (this._tempLayer1) {
                    this._tempLayer1.remove();
                    this._tempLayer1 = null;
                }

            },
            /**
             * 终止绘制功能
             */
            stop: function () {
                this.cancel();
                this._map.off('mousedown', this.eventElement.mousedown);
                this._map.off('mouseup', this.eventElement.mouseup);
                this._map.off('mousemove', this.eventElement.mousemove);
                this._map.off('click', this.eventElement.click);
                this._map.off('dblclick', this.eventElement.dblclick);
                this._container.style.cursor = '';
            }
        };

        //z.draw = draw;
    })(Z);

})(window);