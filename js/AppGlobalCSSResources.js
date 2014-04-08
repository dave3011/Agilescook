//Global CSS description

//TOC
  //General
  //Buttons
  //Iconcolors
  //Toolproperties
  //Commandpanels
  //Thumbnailpanel
  //Comments
  //Occluder
  //Misc

//General
var CSS_DIM_ZERO = 'display: none';
var CSS_CLEAR = 'clear: both;';
var CSS_FLOAT_LEFT = 'float: left;';

var CSS_BOOKVIEWER ='border-color: null; border-width: 0; border-style: null;';

var CSS_DEFAULT_FONT = 'font-family: "open_sansregular","Arial","Helvetica",sans-serif;';

var CONST_DOCVIEW_OFFSETS = [46, 12, 46, 12];// offsets are [left, top, right, bottom
var CONST_BOOKVIEWER_OFFSETS_LANDSCAPE = [0, 48, 0, 48];
var CONST_BOOKVIEWER_OFFSETS_PORTRAIT = [0, 96, 0, 84];
var CSS_BOOKVIEWER_OUTLINE = 'background-color: #ffffff;';
var CONST_MINBOOKEDITORVIEWWIDTH = 700;

var CSS_SCROLLBAR = '';

var CSS_BOX_SHADOW = '-moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3); -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3); box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3);';

//Buttons
var CSS_DEFAULT_BUTTON = 'display: block; float: left;';
var CSS_DEFAULT_BUTTON_ICON = 'font-family: "scook icons"; font-size: 24px; text-align: center; vertical-align: middle; position: absolute; margin: 0; top:0; line-height: 36px; user-select: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -o-user-select: none;';
var CSS_DEFAULT_BUTTON_SIZE = 'width: 46px; height: 36px;';

var CSS_COLOR_BUTTON = 'margin: 5px; display: block; background-size: 160px; background-position: -40px;';
var CSS_COLOR_BUTTON_SIZE = 'width: 30px; height: 30px;';

var CSS_TOGGLEDRAWINGS_BUTTON_SIZE = 'width: 92px; height: 28px;';

var CSS_VISIBILITY_BUTTON_SIZE = 'width: 45px; height: 28px; border: solid black; border-width: 0 1px 0 0;';
var CSS_VISIBILITY_BUTTON_SIZE_DRAWING = 'width: 91px; height: 28px; border: solid black; border-width: 0 1px 0 0;';
var CSS_VISIBILITY_BUTTON_SIZE_TEXT = 'width: 46px; height: 28px;';
var CSS_VISIBILITY_BUTTON_ICON = 'font-family: "scook icons"; font-size: 20px; text-align: center; vertical-align: middle; position: absolute; margin: 0; top:0; line-height: 28px; user-select: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -o-user-select: none;';
var CSS_VISIBILITY_BUTTON_TEXT = 'font-family: "open_sansregular","Arial","Helvetica",sans-serif; font-size: 10px; text-align: center; vertical-align: middle; position: absolute; margin: 0; top:0; line-height: 28px; user-select: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -o-user-select: none;';

var CSS_FULLSCREEN_BUTTON_SIZE = 'width: 174px; height: 36px;';
var CSS_FULLSCREEN_BUTTON_ICON = 'font-family: "open_sansregular","Arial","Helvetica",sans-serif; font-size: 14px; text-align: center; vertical-align: middle; position: absolute; margin: 0; top:0; line-height: 36px; user-select: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -o-user-select: none;';

var CSS_PAGE_SELECTOR = 'float: left; vertical-align: center; overflow: hidden; padding: 5px 10px;';
var CSS_PAGE_SELECTOR_INPUT = 'text-align: center; width: 70px; padding: 0; border-style: solid; border-width: 1px; border-color: #a7a6a6; font-family: "open_sansregular","Arial","Helvetica",sans-serif;';
var CSS_PAGE_SELECTOR_INPUT_FOCUS = 'border-color: #2d86c2;';

var CSS_VERSION_BUTTON_SIZE = 'width: 276px; height: 36px; position: relative; top: auto;';
var CSS_VERSION_BUTTON_SIZE_VERTICAL = 'width: 276px; height: 36px; position: absolute; top: 36px;';
var CSS_VERSION_BUTTON_TEXT = 'font-family: "open_sansregular","Arial","Helvetica",sans-serif; font-size: 12px; margin-top: 0; text-align: center; vertical-align: middle; position: absolute; top:0; line-height: 36px; user-select: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: -moz-none; -o-user-select: none;';

var CSS_OCCLUDER_MINIMIZEICON_BACKGROUND = 'position: absolute; width:36px; height: 36px; left:0;';

//Iconcolors
var CONST_ICON_DEFAULT =  ['#2d86c2', '#414141', '#a7a6a6', '#2d86c2']; //active, default, disabled, hover
var CONST_ICON_BG_DEFAULT = ['rgba(255,255,255,1)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(255,255,255,0.32)'];

var CONST_ICON_INVERSE =  ['#ffffff', '#414141', '#a7a6a6', '#ffffff']; //active, default, disabled, hover
var CONST_ICON_BG_INVERSE = ['#2d86c2', '#2d86c2', '#2d86c2', '#2d86c2'];

var CONST_ICON_COLOR =  ['#ffffff','#ffffff','#ffffff','#ffffff'];
var CONST_ICON_BG_COLOR = ['#a6a6a6','#ededed','#ededed','#a6a6a6'];

var CONST_ICON_VIS =  ['#2d86c2', '#a7a6a6', '#a7a6a6', '#2d86c2'];
var CONST_ICON_BG_VIS = ['#ffffff','#ffffff','#ffffff','#ffffff'];

var CONST_ICON_PAGE =  ['#ededed', '#ffffff', '#ffffff', '#ededed'];
var CONST_ICON_BG_PAGE = ['rgba(36, 107, 155, 1)', 'rgba(45,134,194,1)', 'rgba(45,134,194,0.3)', 'rgba(36, 107, 155, 1)'];

//Toolproperties
var CONST_PEN_STROKE_COLORS = ['#cfde00', '#0fde00', '#00dead', '#004ede', '#6f00de', '#de008d'];
var CONST_PEN_STROKE_THICKNESSES = [6, 10, 14];
var CONST_MARKER_STROKE_COLORS = ['#ff0d9f', '#1fc5f5', '#f9eb0e', '#12e65e'];
var CONST_MARKER_STROKE_THICKNESSES = [22];
var CONST_MARKER_STROKE_OPACITY = 0x99;
var CONST_FORMS_COLORS = ['#ff0d9f', '#1fc5f5', '#f9eb0e', '#12e65e','#ff0d9f', '#1fc5f5', '#f9eb0e', '#12e65e','#ff0d9f', '#1fc5f5'];
var CONST_FORMS_THICKNESSES = [10];

//Commandpanels
var CSS_TOOLSPANELHORIZONTAL ='position: absolute; top:12px; left:0; min-width:368px; background-color: rgba(0,0,0,0.08);';
var CSS_ZOOMPANELHORIZONTAL ='position: absolute; top:12px; right:0; min-width:184px; background-color: rgba(0,0,0,0.08);';
var CSS_TOOLSPANELVERTICAL ='position: absolute; margin-left: -184px; left: 50%; top: 12px; min-width:368px; background-color: rgba(0,0,0,0.08);';
var CSS_ZOOMPANELVERTICAL ='position: absolute; margin-left: -92px; left: 50%; top: 60px; min-width:184px; background-color: rgba(0,0,0,0.08);';
var CSS_NAVIGATIONPANELHORIZONTAL ='position: absolute; left: 50%; bottom: 12px; background-color: rgba(0,0,0,0.08);';
var CSS_NAVIGATIONPANELVERTICAL ='position: absolute; left: 50%; bottom: 12px; background-color: rgba(0,0,0,0.08);';
var CSS_PENSTROKEPANEL = 'position: absolute; background-color: #ffffff; padding: 3px;';
var CSS_MARKERSTROKEPANEL = 'position: absolute; background-color: #ffffff; padding: 3px;';
var CSS_FORMSPANEL = 'position: absolute; background-color: #ffffff; padding: 3px;';
var CSS_VISIBILITYPANEL = 'position: absolute; background-color: #ffffff;';

//Thumbnailpanel
var CSS_SCROLL_VIEWER_CONTAINER = 'position:absolute; bottom:48px; left: 0; right: 0; background-color: #ffffff;';
var CSS_SCROLL_VIEWER_CONTAINER_VERTICAL = 'position:absolute; bottom:84px; left: 0; right: 0; background-color: #ffffff;';
var CSS_SCROLL_VIEWER_CONTAINER_PADDING = 'padding: 19px;';
var CSS_SCROLL_VIEWER_CONTAINER_COLLAPSED = 'position:absolute; bottom:auto; left: auto; right: auto;';
var CSS_SCROLL_VIEWER_CONTAINER_COLLAPSED_HEIGHT = '134px';
var CSS_THUMBNAILS_CONTAINER = 'overflow-y: hidden; white-space: nowrap; margin: 24px 12px 12px 12px;';
var CSS_THUMBNAILS_CONTAINER_OVERVIEW = 'overflow-y: scroll; margin: 28px 19px 19px 19px;';
var CSS_THUMBNAILS_HANDLE = 'background-color: #2d86c2; height: 24px; top: 0; left:auto; right: 0; position: absolute; text-align: right;';
var CSS_THUMBNAIL_HANDLE_TEXT = 'color: #ffffff; margin: 5px 5px 5px 12px; line-height: normal; text-decoration: none; font-size: 14px;';
var CSS_THUMBNAIL_HANDLE_ICON = 'color: #ffffff; margin: 5px 12px 5px 0; line-height: normal; text-decoration: none; font-size: 14px; font-family: "scook icons";';
var CSS_THUMBNAIL = 'display: inline-block; margin-left: 14px; margin-right: 14px; margin-top: 13px; text-align: center;';
var CSS_THUMBNAIL_TEXT = 'padding: 0; padding-top: 5px; color: #787878; line-height: normal; font-size: 12px;';
var CSS_THUMBNAIL_IMAGE_CONTAINER_DEFAULT = 'border-style: none; border-width: 0px; border-color: #ffffff; margin: 0px;';
var CSS_THUMBNAIL_IMAGE_CONTAINER_HOVER = 'border-style: solid; border-width: 3px; border-color: #2d86c2; background-color: #2d86c2; margin: -3px;';
var CSS_THUMBNAIL_BOX_SHADOW = '-moz-box-shadow: 0px 0px 3px 0px rgba(45,134,194,1); -webkit-box-shadow: 0px 0px 3px 0px rgba(45,134,194,1); box-shadow: 0px 0px 3px 0px rgba(45,134,194,1);';
var THUMBNAIL_OVERFLOW_WIDTH = 30;
var THUMBNAIL_OVERFLOW_HEIGHT = 30;
var THUMBNAIL_HEIGHT = 80;
var CSS_THUMBNAILS_CONTAINER_VISIBLE = 'overflow-x: scroll;';
var CSS_THUMBNAILS_CONTAINER_COLLAPSE = 'overflow-x: hidden;';

//Comments
var CSS_COMMENT_HEADER = 'height: 36px; line-height: 36px; vertical-align: middle; background-color: #fff293;';
var CSS_COMMENT_HEADER_TIMESTAMP = 'float: left; margin: 0 10px; font-size: 14px; color: #aba678; font-family: "open_sansregular","Arial","Helvetica",sans-serif; font-style: italic;';
var CSS_COMMENT_MINIMIZE_BUTTON = 'position: absolute; width: 36px; height: 36px; right: 0; background-color: #fff293;';
var CSS_COMMENT_MINIMIZE_BUTTON_ICON = 'font-family: "scook icons"; color: #555555; font-size:20px; text-align: center; vertical-align: middle; position: absolute; margin: 0; top:0; line-height: 36px;';
var CSS_COMMENT_CONTENT = 'background-color: #fff6b2; padding: 11px;';
var CSS_COMMENT_CONTENT_TEXT = 'width:100%; height: 100%; font-size: 14px; line-height: 17px; resize: none; border: 0; background-color: #fff6b2; color: #444444;';
var CSS_COMMENTBORDER = 'position: absolute; top: 0; left: 0; bottom:0; right:0; border: 0 solid red;';

//Occluder
var CSS_OCCLUDER_HEADER = 'height: 36px; line-height: 36px; vertical-align: middle;';
var CSS_OCCLUDER_MINIMIZE_BUTTON = 'position: absolute; width: 36px; height: 36px; right: 0;';
var CSS_OCCLUDER_MINIMIZE_BUTTON_ICON = 'font-family: "scook icons"; color: #2d86c2; font-size:20px; text-align: center; vertical-align: middle; position: absolute; margin: 0; top:0; line-height: 36px;';

//Misc
var CSS_CREATORDECORATOR_STROKEPANEL = 'position: absolute; left: 15px; top: -16px; width: 16px; height: 8px;';
var CSS_CREATORDECORATOR_VISIBILITYPANEL = 'position: absolute; left: 15px; top: -16px; width: 16px; height: 8px;';
var CSS_CREATORDECORATOR_KLICKSTELLELINKS = 'position: absolute; right: -7px; top: 50%; margin-top: -8px; width: 8px; height: 16px; font-size:0;';
var CSS_CREATORDECORATOR_KLICKSTELLERECHTS = 'position: absolute; left: -7px; top: 50%; margin-top: -8px; width: 8px; height: 16px; font-size:0;';

//GLOBAL CONST DO NOT CHANGE
var NEXT_PAGES = -100;
var PREV_PAGES = -101;
