export class Global{
    //Base URI
    public static BASE = 'https://52vtad3xac.execute-api.ap-south-1.amazonaws.com/dev/';
    public static BASE_LOGIN = Global.BASE+'login';
    public static BASE_DASHBOARD = 'https://52vtad3xac.execute-api.ap-south-1.amazonaws.com/dev/dashboard';
    public static BASE_PARENTLIST = 'https://52vtad3xac.execute-api.ap-south-1.amazonaws.com/dev/customer/search';
    public static BASE_CENTERMAP = 'https://52vtad3xac.execute-api.ap-south-1.amazonaws.com/dev/center_map';
    public static BASE_CENTERPICTURE = Global.BASE+'center/';
    public static BASE_CENTERPOPUP = Global.BASE+'center/search';

    // For Whether Third Party API get Details
    public static BASE_CENTERWHETHER = 'http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=edfaf1d75a533cd6eaae4c5ceec16ddb';

    public static BASE_GET_PARENT_CENTER = Global.BASE+'customer/'; // GET
    public static BASE_GET_PARENT_CHILD_ACTIVITY = Global.BASE+'child_activity/search'; //post
    public static BASE_GET_PARENT_CHILD_DETAILS = Global.BASE+'children/search'; //post

    public static BASE_GET_PARENT_NOTIFICATION = Global.BASE+'parent_notification/search'; //parent notification list -  post api

    public static BASE_GET_PARENT_DETAIL_NOTIFICATION = Global.BASE+'parent_notification'; //center - parent Detail Notification API

    public static BASE_GET_DEVICE_TOKEN = Global.BASE+'customer/';     //customer/<customer_id>  PATCH
    
}