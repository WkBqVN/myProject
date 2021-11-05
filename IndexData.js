"use strict";
// const have all const needed
// have method to get right url
const gREQUEST_STATUS_OK = 200;
const gREQUEST_READY_STATUS_FINISH_AND_OK = 4;
const gREQUEST_CREATE_SUCCESS = 201;
const gREQUEST_CONTENT = "application/json;charset=UTF-8";
const gNO_DISCOUNT = 0;
const gBASE_URL = {
    ORDER_BASE_URL: "http://42.115.221.44:8080/devcamp-pizza365/orders",
    VOUCHER_BASE_URL: "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail/",
    DRINK_BASE_URL: "http://42.115.221.44:8080/devcamp-pizza365/drinks",
    VIEW_ORDER_URL: "viewOrder.html",
    getDrinkListUrl: function () {
        return this.DRINK_BASE_URL;
    },
    getVoucherUrl: function (paramMaVoucher) {
        return this.VOUCHER_BASE_URL + paramMaVoucher;
    },
    getCreateOrderUrl : function(){
        return this.ORDER_BASE_URL;
    },
    getOrderById: function(paramId){
        return this.ORDER_BASE_URL + "/" + paramId;
    },
    getViewOrderUrl : function(paramId,paramOrderId){
        return this.VIEW_ORDER_URL + "?id=" + paramId + "&orderid=" + paramOrderId;
    },
    getAllOrderUrl : function(){
        return this.ORDER_BASE_URL;
    },
    getUpdateOrderUrl :function(paramOrderId){
        return this.ORDER_BASE_URL +"/" + paramOrderId;
    }
}
// const for bind data for sizes
const gALL_MENU = {
    menuSmall: {
        menuName: "S",    // S, M, L
        duongKinhCM: 20,
        suongNuong: 2,
        saladGr: 200,
        drinkNumber: 2,
        priceVND: 150000
    },
    menuMedium: {
        menuName: "M",    // S, M, L
        duongKinhCM: 25,
        suongNuong: 4,
        saladGr: 300,
        drinkNumber: 3,
        priceVND: 200000
    },
    menuLarge: {
        menuName: "L",    // S, M, L
        duongKinhCM: 30,
        suongNuong: 8,
        saladGr: 500,
        drinkNumber: 4,
        priceVND: 250000
    }
}
// function send request to Server
//in : method, xml obj, url, async flag, json obj
//out: send requets to server
function sendRequestToServer(paramMethod, paramXMLHttp, paramUrl, paramAsync, paramObj) {
    "use strict";
    switch (paramMethod) {
        case "GET":
            try {
                paramXMLHttp.open(paramMethod, paramUrl, paramAsync);
                paramXMLHttp.send();
            } catch (error) {
                console.log("Không thể gửi GET request");
                console.log(error);
            }
            break;
        case "POST":
            try {
                paramXMLHttp.open(paramMethod, paramUrl, paramAsync);
                paramXMLHttp.setRequestHeader("Content-Type", gREQUEST_CONTENT);
                paramXMLHttp.send(JSON.stringify(paramObj));
            } catch (error) {
                console.log("Không thể gửi POST request");
                console.log(error);
            }
            break;
        case "PUT":
            try {
                paramXMLHttp.open(paramMethod, paramUrl, paramAsync);
                paramXMLHttp.setRequestHeader("Content-Type", gREQUEST_CONTENT);
                paramXMLHttp.send(JSON.stringify(paramObj));
            } catch (error) {
                console.log("Không thể gửi PUT request");
                console.log(error);
            }
            break;
    }
}