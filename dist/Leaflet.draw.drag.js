"use strict";if(L.Browser.svg){L.Path.include({_resetTransform:function(){this._container.setAttributeNS(null,"transform","")},_applyTransform:function(t){this._container.setAttributeNS(null,"transform","matrix("+t.join(" ")+")")}})}else{L.Path.include({_resetTransform:function(){if(this._skew){this._skew.on=false;this._container.removeChild(this._skew);this._skew=null}},_applyTransform:function(t){var e=this._skew;if(!e){e=this._createElement("skew");this._container.appendChild(e);e.style.behavior="url(#default#VML)";this._skew=e}var i=t[0].toFixed(8)+" "+t[1].toFixed(8)+" "+t[2].toFixed(8)+" "+t[3].toFixed(8)+" 0 0";var a=Math.floor(t[4]).toFixed()+", "+Math.floor(t[5]).toFixed()+"";var r=this._container.style;var s=parseFloat(r.left);var o=parseFloat(r.top);var n=parseFloat(r.width);var h=parseFloat(r.height);if(isNaN(s))s=0;if(isNaN(o))o=0;if(isNaN(n)||!n)n=1;if(isNaN(h)||!h)h=1;var _=(-s/n-.5).toFixed(8)+" "+(-o/h-.5).toFixed(8);e.on="f";e.matrix=i;e.origin=_;e.offset=a;e.on=true}})}L.Path.include({_onMouseClick:function(t){if(this.dragging&&this.dragging.moved()||this._map.dragging&&this._map.dragging.moved()){return}this._fireMouseEvent(t)}});"use strict";L.Handler.PathDrag=L.Handler.extend({initialize:function(t){this._path=t;this._matrix=null;this._startPoint=null;this._dragStartPoint=null},addHooks:function(){this._path.on("mousedown",this._onDragStart,this);L.DomUtil.addClass(this._path._container,"leaflet-path-draggable")},removeHooks:function(){this._path.off("mousedown",this._onDragStart,this);L.DomUtil.removeClass(this._path._container,"leaflet-path-draggable")},moved:function(){return this._path._dragMoved},_onDragStart:function(t){this._startPoint=t.containerPoint.clone();this._dragStartPoint=t.containerPoint.clone();this._matrix=[1,0,0,1,0,0];this._path._map.on("mousemove",this._onDrag,this).on("mouseup",this._onDragEnd,this);this._path._dragMoved=false},_onDrag:function(t){var e=t.containerPoint.x;var i=t.containerPoint.y;var a=e-this._startPoint.x;var r=i-this._startPoint.y;if(!this._path._dragMoved&&(a||r)){this._path._dragMoved=true;this._path.fire("dragstart")}this._matrix[4]+=a;this._matrix[5]+=r;this._startPoint.x=e;this._startPoint.y=i;this._path._applyTransform(this._matrix);this._path.fire("drag");L.DomEvent.stop(t.originalEvent)},_onDragEnd:function(t){L.DomEvent.stop(t);this._path._resetTransform();this._transformPoints();this._path._map.off("mousemove",this._onDrag,this).off("mouseup",this._onDragEnd,this);this._path.fire("dragend",{distance:Math.sqrt(L.LineUtil._sqDist(this._dragStartPoint,t.containerPoint))});this._matrix=null;this._startPoint=null;this._dragStartPoint=null},_transformPoints:function(){var t=this._matrix;var e=t[0];var i=t[1];var a=t[2];var r=t[3];var s=t[4];var o=t[5];var n=this._path;var h=this._path._map;var _,g,d,p;function l(t){var n=t.x;var h=t.y;t.x=e*n+a*h+s;t.y=i*n+r*h+o;return t}if(n._point){n._latlng=h.layerPointToLatLng(l(n._point))}else if(n._originalPoints){for(_=0,d=n._originalPoints.length;_<d;_++){n._latlngs[_]=h.layerPointToLatLng(l(n._originalPoints[_]))}}if(n._holes){for(_=0,d=n._holes.length;_<d;_++){for(g=0,p=n._holes[_].length;g<p;g++){n._holes[_][g]=h.layerPointToLatLng(l(n._holePoints[_][g]))}}}n._updatePath()}});(function(){var t=L.Path.prototype._initEvents;L.Path.prototype._initEvents=function(){t.call(this);if(this.options.draggable){if(this.dragging){this.dragging.enable()}else{this.dragging=new L.Handler.PathDrag(this);this.dragging.enable()}}else if(this.dragging){this.dragging.disable()}}})();L.Polygon.include({getCenter:function(){var t,e,i,a,r,s,o,n,h,_=this._parts[0];o=n=h=0;for(t=0,i=_.length,e=i-1;t<i;e=t++){a=_[t];r=_[e];s=a.y*r.x-r.y*a.x;n+=(a.x+r.x)*s;h+=(a.y+r.y)*s;o+=s*3}return this._map.layerPointToLatLng([n/o,h/o])}});"use strict";L.EditToolbar.Edit.MOVE_MARKERS=false;L.EditToolbar.Edit.include({initialize:function(t,e){L.EditToolbar.Edit.MOVE_MARKERS=!!e.selectedPathOptions.moveMarkers;this._initialize(t,e)},_initialize:L.EditToolbar.Edit.prototype.initialize});L.Edit.SimpleShape.include({_updateMoveMarker:function(){if(this._moveMarker){this._moveMarker.setLatLng(this._getShapeCenter())}},_getShapeCenter:function(){return this._shape.getBounds().getCenter()},_createMoveMarker:function(){if(L.EditToolbar.Edit.MOVE_MARKERS){this._moveMarker=this._createMarker(this._getShapeCenter(),this.options.moveIcon)}}});L.Edit.SimpleShape.mergeOptions({moveMarker:false});L.Edit.Circle.include({addHooks:function(){if(this._shape._map){this._map=this._shape._map;if(!this._markerGroup){this._enableDragging();this._initMarkers()}this._shape._map.addLayer(this._markerGroup)}},removeHooks:function(){if(this._shape._map){for(var t=0,e=this._resizeMarkers.length;t<e;t++){this._unbindMarker(this._resizeMarkers[t])}this._disableDragging();this._resizeMarkers=null;this._map.removeLayer(this._markerGroup);delete this._markerGroup}this._map=null},_createMoveMarker:L.Edit.SimpleShape.prototype._createMoveMarker,_resize:function(t){var e=this._shape.getLatLng();var i=e.distanceTo(t);this._shape.setRadius(i);this._updateMoveMarker()},_enableDragging:function(){if(!this._shape.dragging){this._shape.dragging=new L.Handler.PathDrag(this._shape)}this._shape.dragging.enable();this._shape.on("dragstart",this._onStartDragFeature,this).on("dragend",this._onStopDragFeature,this)},_disableDragging:function(){this._shape.dragging.disable();this._shape.off("dragstart",this._onStartDragFeature,this).off("dragend",this._onStopDragFeature,this)},_onStartDragFeature:function(){this._shape._map.removeLayer(this._markerGroup);this._shape.fire("editstart")},_onStopDragFeature:function(){var t=this._shape.getLatLng();this._resizeMarkers[0].setLatLng(this._getResizeMarkerPoint(t));this._shape._map.addLayer(this._markerGroup);this._updateMoveMarker();this._fireEdit()}});L.Edit.Rectangle.include({addHooks:function(){if(this._shape._map){if(!this._markerGroup){this._enableDragging();this._initMarkers()}this._shape._map.addLayer(this._markerGroup)}},removeHooks:function(){if(this._shape._map){this._shape._map.removeLayer(this._markerGroup);this._disableDragging();delete this._markerGroup;delete this._markers}},_resize:function(t){this._shape.setBounds(L.latLngBounds(t,this._oppositeCorner));this._updateMoveMarker()},_onMarkerDragEnd:function(t){this._toggleCornerMarkers(1);this._repositionCornerMarkers();L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this,t)},_enableDragging:function(){if(!this._shape.dragging){this._shape.dragging=new L.Handler.PathDrag(this._shape)}this._shape.dragging.enable();this._shape.on("dragstart",this._onStartDragFeature,this).on("dragend",this._onStopDragFeature,this)},_disableDragging:function(){this._shape.dragging.disable();this._shape.off("dragstart",this._onStartDragFeature,this).off("dragend",this._onStopDragFeature,this)},_onStartDragFeature:function(){this._shape._map.removeLayer(this._markerGroup);this._shape.fire("editstart")},_onStopDragFeature:function(){var t=this._shape;for(var e=0,i=t._latlngs.length;e<i;e++){var a=this._resizeMarkers[e];a.setLatLng(t._latlngs[e]);a._origLatLng=t._latlngs[e];if(a._middleLeft){a._middleLeft.setLatLng(this._getMiddleLatLng(a._prev,a))}if(a._middleRight){a._middleRight.setLatLng(this._getMiddleLatLng(a,a._next))}}this._shape._map.addLayer(this._markerGroup);this._updateMoveMarker();this._repositionCornerMarkers();this._fireEdit()}});L.Edit.Poly.include({__createMarker:L.Edit.Poly.prototype._createMarker,__removeMarker:L.Edit.Poly.prototype._removeMarker,addHooks:function(){if(this._poly._map){if(!this._markerGroup){this._enableDragging();this._initMarkers();this._createMoveMarker()}this._poly._map.addLayer(this._markerGroup)}},_createMoveMarker:function(){if(L.EditToolbar.Edit.MOVE_MARKERS&&this._poly instanceof L.Polygon){this._moveMarker=new L.Marker(this._getShapeCenter(),{icon:this.options.moveIcon});this._moveMarker.on("mousedown",this._delegateToShape,this);this._markerGroup.addLayer(this._moveMarker)}},_delegateToShape:function(t){var e=this._shape||this._poly;var i=t.target;e.fire("mousedown",L.Util.extend(t,{containerPoint:L.DomUtil.getPosition(i._icon).add(e._map._getMapPanePos())}))},_getShapeCenter:function(){return this._poly.getCenter()},removeHooks:function(){if(this._poly._map){this._poly._map.removeLayer(this._markerGroup);this._disableDragging();delete this._markerGroup;delete this._markers}},_enableDragging:function(){if(!this._poly.dragging){this._poly.dragging=new L.Handler.PathDrag(this._poly)}this._poly.dragging.enable();this._poly.on("dragstart",this._onStartDragFeature,this).on("dragend",this._onStopDragFeature,this)},_disableDragging:function(){this._poly.dragging.disable();this._poly.off("dragstart",this._onStartDragFeature,this).off("dragend",this._onStopDragFeature,this)},_onStartDragFeature:function(t){this._poly._map.removeLayer(this._markerGroup);this._poly.fire("editstart")},_onStopDragFeature:function(t){var e=this._poly;for(var i=0,a=e._latlngs.length;i<a;i++){var r=this._markers[i];r.setLatLng(e._latlngs[i]);r._origLatLng=e._latlngs[i];if(r._middleLeft){r._middleLeft.setLatLng(this._getMiddleLatLng(r._prev,r))}if(r._middleRight){r._middleRight.setLatLng(this._getMiddleLatLng(r,r._next))}}this._poly._map.addLayer(this._markerGroup);L.Edit.SimpleShape.prototype._updateMoveMarker.call(this);this._fireEdit()},_updateMoveMarker:L.Edit.SimpleShape.prototype._updateMoveMarker,_createMarker:function(t,e){var i=this.__createMarker(t,e);i.on("dragstart",this._hideMoveMarker,this).on("dragend",this._showUpdateMoveMarker,this);return i},_removeMarker:function(t){this.__removeMarker(t);t.off("dragstart",this._hideMoveMarker,this).off("dragend",this._showUpdateMoveMarker,this)},_hideMoveMarker:function(){if(this._moveMarker){this._markerGroup.removeLayer(this._moveMarker)}},_showUpdateMoveMarker:function(){if(this._moveMarker){this._markerGroup.addLayer(this._moveMarker);this._updateMoveMarker()}}});L.Edit.Poly.prototype.options.moveIcon=new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon leaflet-edit-move"});L.Edit.Poly.mergeOptions({moveMarker:false});