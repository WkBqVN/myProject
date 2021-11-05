"use strict";
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
// const have all element and one method for swap color
const gALL_ELEMENT = {
    btnMenuSmall: document.getElementById("btn-menu-small"),
    btnMenuMedium: document.getElementById("btn-menu-medium"),
    btnMenuLarge: document.getElementById("btn-menu-large"),
    btnTypePizzaHawaii: document.getElementById("btn-type-pizza-hawai"),
    btnTypePizzaSeafood: document.getElementById("btn-type-pizza-seafood"),
    btnTypePizzaBacon: document.getElementById("btn-type-pizza-bacon"),
    btnSendOrder: document.getElementById("btn-send-order"),
    btnConfirmOder: document.getElementById("btn-confirm"),
    selectDrink: document.getElementById("select-drink"),
    barFollowOrder: document.getElementById("nav-follow-order"),
    //functin to change color btn when click
    swapColor: function (paramClickedBtn, paramOtherBtnA, paramOtherBtnB) {
        paramClickedBtn.className = "btn btn-warning w-100";
        paramOtherBtnA.className = "btn btn-success w-100";
        paramOtherBtnB.className = "btn btn-success w-100";
    }
}
// variable obj to handle all info
// menu-typepizza-type-drink-order-formdata
// have method for set, get discount and price
var gPersonOrderDetail = {
    selectedMenu: null,
    selectedPizzaType: "",
    selectedDinkType: "",
    personData: null,
    OrderData: null,
    setMenu: function (paramMenu) {
        this.selectedMenu = paramMenu;
    },
    setPizzaType: function (paramPizzaType) {
        this.selectedPizzaType = paramPizzaType;
    },
    setDrinkType: function (paramDrinkType) {
        this.selectedDinkType = paramDrinkType;
    },
    setFormData: function (paramFormObj) {
        this.personData = paramFormObj;
    },
    getDiscount: function () {
        if (this.personData.voucher !== null) {
            return parseInt(this.personData.voucher.phanTramGiamGia);
        } else {
            return gNO_DISCOUNT;
        }
    },
    getPrice: function () {
        let vPrice = this.selectedMenu.priceVND;
        return vPrice * (1 - this.getDiscount() / 100);
    },
    setOrderData: function (paramOrderObj) {
        this.OrderData = paramOrderObj;
    }
}
/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
onPageLoading();
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
// function to handle confirm btn cick
//in: confirm btn
//out : creater order request , bind dataset for nav bar
function onConfirmBtnClick(paramConfirmBtn) {
    "use strict";
    //1. read data
    console.log("Bạn đã xác nhận đơn");
    paramConfirmBtn.style.display = "none";
    gALL_ELEMENT.btnSendOrder.innerHTML = "Xem lại Thông tin Order";
    let vCreateOrderUrl = gBASE_URL.getCreateOrderUrl();
    let vXmlHttp = new XMLHttpRequest();
    let vOrderRequestObj = {
        kichCo: gPersonOrderDetail.selectedMenu.menuName,
        duongKinh: gPersonOrderDetail.selectedMenu.duongKinhCM.toString(),
        suon: gPersonOrderDetail.selectedMenu.suongNuong.toString(),
        salad: gPersonOrderDetail.selectedMenu.saladGr.toString(),
        loaiPizza: gPersonOrderDetail.selectedPizzaType.toString().toUpperCase(),
        idVourcher: (gPersonOrderDetail.personData.voucher !== null) ?
            gPersonOrderDetail.personData.voucher.maVoucher.toString() : "No Id",
        idLoaiNuocUong: gPersonOrderDetail.selectedDinkType,
        soLuongNuoc: gPersonOrderDetail.selectedMenu.drinkNumber,
        hoTen: gPersonOrderDetail.personData.fullName,
        thanhTien: gPersonOrderDetail.getPrice().toString(),
        email: gPersonOrderDetail.personData.email,
        soDienThoai: gPersonOrderDetail.personData.phoneNumber,
        diaChi: gPersonOrderDetail.personData.address,
        loiNhan: gPersonOrderDetail.personData.message,
    }
    // 2. send request to server
    sendRequestToServer("POST", vXmlHttp, vCreateOrderUrl, true, vOrderRequestObj);
    //3.handle server
    vXmlHttp.onreadystatechange = function () {
        if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_CREATE_SUCCESS) {
            console.log("Order is created!!!")
            console.log(this.responseText);
            gPersonOrderDetail.setOrderData(JSON.parse(this.responseText));
            gALL_ELEMENT.barFollowOrder.setAttribute("data-id", gPersonOrderDetail.OrderData.id);
            gALL_ELEMENT.barFollowOrder.setAttribute("data-orderid", gPersonOrderDetail.OrderData.orderId);
            gALL_ELEMENT.barFollowOrder.href = gBASE_URL.getViewOrderUrl(gALL_ELEMENT.barFollowOrder.dataset.id,
                gALL_ELEMENT.barFollowOrder.dataset.orderid);
            document.getElementById("text-result").innerHTML = "Mã Voucher của bạn: " + gPersonOrderDetail.OrderData.orderId;
        }
    }
}
/*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
//fucntion auload when page loadign
function onPageLoading() {
    loadOptionsToDrinkSelect();
    loadEventToElements();
}
// function load drink option to select
// in: no params
// out : select element have options list of drinks
function loadOptionsToDrinkSelect() {
    "use strict";
    //1. read data
    let vSelectElement = document.getElementById("select-drink");
    let vXmlHttp = new XMLHttpRequest();
    let vDrinkUrl = gBASE_URL.getDrinkListUrl();
    //2. send request to server
    sendRequestToServer("GET", vXmlHttp, vDrinkUrl, true);
    //3. handle append option to select drink element
    vXmlHttp.onreadystatechange = function () {
        if (this.readyState == gREQUEST_READY_STATUS_FINISH_AND_OK && this.status == gREQUEST_STATUS_OK) {
            console.log("Drink List is loaded!!!");
            console.log(this.responseText);
            let vDrinkObj = JSON.parse(vXmlHttp.responseText);
            for (let bI = 0; bI < vDrinkObj.length; bI++) {
                let vOption = document.createElement("option");
                vOption.value = vDrinkObj[bI].maNuocUong;
                vOption.text = vDrinkObj[bI].tenNuocUong;
                vSelectElement.appendChild(vOption);
            }
        }
    }
}
// function to load event to btns
// in: no params
// out: all btn get click event
function loadEventToElements() {
    "use strict";
    // Menu button event
    gALL_ELEMENT.btnMenuSmall.addEventListener("click", function () {
        console.log("Bạn đã chọn menu Small (S)");
        gALL_ELEMENT.swapColor(this, gALL_ELEMENT.btnMenuLarge, gALL_ELEMENT.btnMenuMedium);
        gPersonOrderDetail.setMenu(gALL_MENU.menuSmall);
    })
    gALL_ELEMENT.btnMenuMedium.addEventListener("click", function () {
        console.log("Bạn đã chọn menu Medium (M)");
        gALL_ELEMENT.swapColor(this, gALL_ELEMENT.btnMenuLarge, gALL_ELEMENT.btnMenuSmall);
        gPersonOrderDetail.setMenu(gALL_MENU.menuMedium);
    })
    gALL_ELEMENT.btnMenuLarge.addEventListener("click", function () {
        console.log("Bạn đã chọn menu Small (L)");
        gALL_ELEMENT.swapColor(this, gALL_ELEMENT.btnMenuSmall, gALL_ELEMENT.btnMenuMedium);
        gPersonOrderDetail.setMenu(gALL_MENU.menuLarge);
    })
    // pizza type event
    gALL_ELEMENT.btnTypePizzaHawaii.addEventListener("click", function () {
        console.log("Bạn đã chọn loại pizza Hawaii");
        gALL_ELEMENT.swapColor(this, gALL_ELEMENT.btnTypePizzaBacon, gALL_ELEMENT.btnTypePizzaSeafood);
        gPersonOrderDetail.setPizzaType("Hawaii");
    })
    gALL_ELEMENT.btnTypePizzaSeafood.addEventListener("click", function () {
        console.log("Bạn đã chọn loại pizza Hải Sản");
        gALL_ELEMENT.swapColor(this, gALL_ELEMENT.btnTypePizzaBacon, gALL_ELEMENT.btnTypePizzaHawaii);
        gPersonOrderDetail.setPizzaType("Seafood");
    })
    gALL_ELEMENT.btnTypePizzaBacon.addEventListener("click", function () {
        console.log("Bạn đã chọn loại pizza Thịt Xông Khói");
        gALL_ELEMENT.swapColor(this, gALL_ELEMENT.btnTypePizzaSeafood, gALL_ELEMENT.btnTypePizzaHawaii);
        gPersonOrderDetail.setPizzaType("Bacon");
    })
    //drink type event
    gALL_ELEMENT.selectDrink.addEventListener("change", function () {
        console.log("Bạn đã chọn nước uống: " + this.options[this.selectedIndex].text);
        gPersonOrderDetail.setDrinkType(this.options[this.selectedIndex].value);
    });
    // btn send
    gALL_ELEMENT.btnSendOrder.addEventListener("click", function () {
        console.log("Bạn đã gửi đơn. hãy kiểm tra đơn của bạn lại lần nữa");
        let vFormData = getFormData();
        if (vFormData !== null) {
            gPersonOrderDetail.setFormData(vFormData);
            if (validatePersonOrderData(gPersonOrderDetail)) {
                console.log(gPersonOrderDetail);
                displayOrder(gPersonOrderDetail);
            }
        }
    });
    // btn confrim
    gALL_ELEMENT.btnConfirmOder.addEventListener("click", function () {
        onConfirmBtnClick(this);
    });
}
// functin to get form data
// in :no params
//out : retur a obj if data is validated else return null
function getFormData() {
    "use strict";
    let vFormObj = {};
    let vFullnameElement = document.getElementById("inp-fullname");
    let vEmailElement = document.getElementById("inp-email");
    let vPhoneNumberElement = document.getElementById("inp-dien-thoai");
    let vAddressElement = document.getElementById("inp-dia-chi");
    let vVoucherElement = document.getElementById("inp-voucher");
    let vMessageElement = document.getElementById("inp-message");

    vFormObj.fullName = vFullnameElement.value.trim();
    vFormObj.email = vEmailElement.value.trim();
    vFormObj.phoneNumber = vPhoneNumberElement.value.trim();
    vFormObj.address = vAddressElement.value.trim();
    vFormObj.voucher = getVoucherByMaVoucher(vVoucherElement.value.trim());
    vFormObj.message = vMessageElement.value.trim();

    if (validateFormData(vFormObj)) {
        return vFormObj;
    } else {
        return null;
    }
}
//function to validate form data
//in: a param obj
//out: true or false;
function validateFormData(paramFormObj) {
    "use strict";
    if (paramFormObj === null) {
        return false;
    }
    let vSpecialRegex = /[!#$@%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (paramFormObj.fullName === "" || vSpecialRegex.test(paramFormObj.fullName)) {
        alert("Họ và Tên của bạn không hợp lệ...");
        return false;
    }
    if (paramFormObj.email === "" || !paramFormObj.email.includes('@')) {
        alert("Email của bạn không hợp lệ...");
        return false;
    } else {
        let vEmailSpecialRegex = /[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?\s]+/;
        if (vEmailSpecialRegex.test(paramFormObj.email)) {
            alert("Email của bạn có ký tự đặc biệt không hợp lệ (chỉ chứa @ và .)");
            return false;
        }
    }
    if (isNaN(parseInt(paramFormObj.phoneNumber)) || paramFormObj.phoneNumber.length != 10) {
        alert("Số điện thoại của bạn không hợp lệ...");
        return false;
    }
    if (paramFormObj.address === "") {
        alert("Địa chỉ của bạn không hợp lệ...");
        return false;
    } else {
        let vAddressSpecialRegex = /[!#$@%^&*()_+\-=\[\]{};':"\\|.<>\/?]+/;
        if (vAddressSpecialRegex.test(paramFormObj.address)) {
            alert("Địa chỉ của bạn có ký tự không hợp lệ. Hãy dùng dấu ',' ")
        }
    }
    if (paramFormObj.voucher === null) {
        alert("Mã Voucher không tồn tại . ");
    }
    return true;
}
// functin to validate person data
//int : person obj
//out : true or false
function validatePersonOrderData(paramPersonOrderDataObj) {
    "use strict";
    if (paramPersonOrderDataObj.personData === null) {
        alert("Hãy điền đầy đủ thông tin ở form gửi đơn....");
        return false;
    }
    if (paramPersonOrderDataObj.selectedDinkType === "") {
        alert("Hãy chọn loại đồ uống....");
        return false;
    }
    if (paramPersonOrderDataObj.selectedMenu == null) {
        alert("Hãy chọn loại Menu...");
        return false;
    }
    if (paramPersonOrderDataObj.selectedPizzaType === "") {
        alert("Hãy chọn loại pizza...");
        return false;
    }
    return true;
}
// function to getVoucher by id
// in: param ma voucher
//out: obj have param mavoucher if no return null
function getVoucherByMaVoucher(paramMaVoucher) {
    "use strict";
    let vVoucherObj = null;
    let vVoucherUrl = gBASE_URL.getVoucherUrl(paramMaVoucher);
    let vXmlHttp = new XMLHttpRequest();
    sendRequestToServer("GET", vXmlHttp, vVoucherUrl, false);
    if (vXmlHttp.status == gREQUEST_STATUS_OK) {
        vVoucherObj = JSON.parse(vXmlHttp.responseText);
    }
    return vVoucherObj;
}
// function to display result
// in: papramPerson obj have all info
//out: text-result element show
function displayOrder(paramPersonOrder) {
    "use strict";
    let vResultText = document.getElementById("text-result");
    let vResutlDiv = document.getElementById("div-result");
    vResutlDiv.style.display = "block";
    let vRuleText = "--------------------------------------------------------------------------------------------------";
    let vFormResult = "Họ và Tên: " + gPersonOrderDetail.personData.fullName
        + "<br>Email: " + gPersonOrderDetail.personData.email
        + "<br>Điện thoại: " + gPersonOrderDetail.personData.phoneNumber
        + "<br>Địa chỉ: " + gPersonOrderDetail.personData.address
        + "<br>Lời nhắn: " + gPersonOrderDetail.personData.message;
    let vMenuResult = "Kích Cỡ: " + gPersonOrderDetail.selectedMenu.menuName
        + "<br>Đường Kính: " + gPersonOrderDetail.selectedMenu.duongKinhCM + " Cm"
        + "<br>Sườn Nướng: " + gPersonOrderDetail.selectedMenu.suongNuong + " Miếng"
        + "<br>Salad: " + gPersonOrderDetail.selectedMenu.saladGr + " Gram"
        + "<br>Nước Ngọt: " + gPersonOrderDetail.selectedMenu.drinkNumber + " Ly";
    let vTypeAndDiscountResult = "Loại Pizza: " + gPersonOrderDetail.selectedPizzaType
        + "<br>Mã Voucher: " + ((gPersonOrderDetail.personData.voucher === null) ?
            "" : gPersonOrderDetail.personData.voucher.maVoucher)
        + "<br>Giá VND: " + gPersonOrderDetail.selectedMenu.priceVND + " VND"
        + "<br>Discount: " + gPersonOrderDetail.getDiscount() + " %"
        + "<br>Phải Thanh Toán: " + gPersonOrderDetail.getPrice();
    vResultText.innerHTML = vFormResult + "<br>" + vRuleText
        + "<br>" + vMenuResult + "<br>" + vRuleText
        + "<br>" + vTypeAndDiscountResult;
}
