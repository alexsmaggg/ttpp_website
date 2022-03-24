let myMap;
let isFiltering;
let cancelBtn;
let filterServiceCodes;

const wrapper = document.querySelector(".wrapper-header");
const cardTemplate = document.getElementById("card");
const detailsTemplate =  document.getElementById("details");
const serviceItemTemplate = document.getElementById("service-item");
const delailsContent = document.querySelector(".os-content");
const detailedSideBar = document.querySelector(".detailed-side");
const mfcSideBar = document.querySelector(".mfc-sidebar");
const mfcSideBarWrap = document.querySelector(".swipe-wrapp-sidebar");
const chkbxInputs = document.querySelectorAll(".checkbox__input");
const chkbxInput = document.querySelector(".checkbox__input");
const cards = document.querySelector(".item-cards");
const filter = document.querySelector(".filter-wrapp");
filterServiceCodes = [];

let headerHeight = wrapper.clientHeight;
let sideBarHeight = 100-(headerHeight*100/document.documentElement.clientHeight);
mfcSideBar.style.top = `${headerHeight}px`;
detailedSideBar.style.top = `${headerHeight}px`;
mfcSideBarWrap.style.height = `${sideBarHeight}%`;
let mfcSidebarHeadHeight = document.querySelector(".mfc-sidebar-head").offsetHeight;
let mfcCardsHeight =  document.querySelector(".item-cards").offsetHeight;
cards.style.height = `${mfcCardsHeight-mfcSidebarHeadHeight}px`;

function cardsHandler() {
	cards.classList.toggle("inactive");
  cards.classList.toggle("active");
  filter.classList.toggle("inactive");
  filter.classList.toggle("active");
  ftrButton.classList.toggle("active");
}

const ftrButton = document.querySelector(".mfc-sidebar-btn-filter");
ftrButton.addEventListener("click", cardsHandler, false);

offices.forEach(office => {
    let clone = cardTemplate.content.cloneNode(true); 
    let title = clone.querySelector(".mfc-field__title");
    let subtitle = clone.querySelector(".mfc-field__subtitle");
    let fields = document.querySelector(".fields-group");
    let link = clone.querySelector(".mfc-field__link");
    title.textContent = office.title;
    subtitle.textContent = office.subtitle;

    link.addEventListener("click", () => {
        detailedSideBar.classList.toggle("hide-d");
        detailedSideBar.classList.toggle("show-d");
        mfcSideBar.classList.toggle("show-d");
        mfcSideBar.classList.toggle("hide-d");

        createAndAppendDelails(office);

    })

    fields.appendChild(clone);

})

let clsButton = document.querySelector(".detailed-side .close-btn");
clsButton.addEventListener("click", () => {
    detailedSideBar.classList.toggle("hide-d");
    detailedSideBar.classList.toggle("show-d");
    mfcSideBar.classList.toggle("show-d");
    mfcSideBar.classList.toggle("hide-d");

});

cancelBtn = document.querySelector(".filter-wrapp__btn--cancel");



ymaps.ready(init);

function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map', {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center: [54.19, 37.61], // Москва
        zoom: 10
    }, {
    });

    myMap.controls.remove("zoomControl");
    myMap.controls.remove("rulerControl");

    let allGeoObjects = [];
    
    offices.forEach(office => {
        let placemark = new ymaps.Placemark(office.center, { id: office.code});
        allGeoObjects.push(placemark);
    })

    allGeoObjects.forEach(obj => {
      myMap.geoObjects.add(obj);
    })

    myMap.geoObjects.events.add("click", (e) => {
      detailedSideBar.classList.remove("hide-d");
      detailedSideBar.classList.add("show-d");
      mfcSideBar.classList.remove("show-d");
      mfcSideBar.classList.add("hide-d");
      let objCode = e.get("target").properties._data.id;
      let office = offices.find(office => office.code === objCode);
      createAndAppendDelails(office);
    })
    
    chkbxInputs.forEach(chkbox => {
      chkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          filterServiceCodes.push(e.target.dataset.serviceCode)
        }
        else {
          filterServiceCodes = filterServiceCodes.filter(item => item !== e.target.dataset.serviceCode)
        }
        
        filterGeoObject(allGeoObjects,myMap);            
      })
    })

    cancelBtn.addEventListener("click", () => {
      filterServiceCodes = [];
      chkbxInputs.forEach(chkbox => {
        chkbox.checked = false;
      })

      myMap.geoObjects.removeAll();
      allGeoObjects.forEach(obj => {
        myMap.geoObjects.add(obj);
      })
      cardsHandler();
    })
        
      
    myMap.setBounds(myMap.geoObjects.getBounds());

}

function filterGeoObject(allGeoObjects, map) {
  let filteredGeoObjects = [];
  allGeoObjects.forEach((obj) => {
    let objCode = obj.properties._data.id;
    let office = offices.find(office => office.code === objCode);
    filterServiceCodes.forEach((code) => {
      if ( office.services.indexOf(Number(code)) != -1 ) { 
        filteredGeoObjects.push(obj);
      }
    })
  })
  map.geoObjects.removeAll();
  filteredGeoObjects.forEach((obj) => {
    map.geoObjects.add(obj);
  })     
} 


function createAndAppendDelails (office) {

  while (delailsContent.firstChild) {
    delailsContent.removeChild(delailsContent.firstChild);
  }

  let clone = detailsTemplate.content.cloneNode(true); 
  let title = clone.querySelector(".detailed-side-head__title span");
  let subtitle =  clone.querySelector(".detailed-side-head__subtitle");
  let serviceBtn = clone.querySelector(".service__btn");
  let contactBtn = clone.querySelector(".contact__btn");
  let serviceBlock = clone.querySelector(".detailed-service-block");
  let contactBlock = clone.querySelector(".detailed-contacts-block");

  serviceBtn.addEventListener("click", () => {
    serviceBtn.classList.toggle("active");
    contactBtn.classList.toggle("active");
    serviceBlock.classList.remove("inactive");
    contactBlock.classList.add("inactive");
  });

  contactBtn.addEventListener("click", () => {
    contactBtn.classList.toggle("active");
    serviceBtn.classList.toggle("active");
    serviceBlock.classList.add("inactive");
    contactBlock.classList.remove("inactive");
  })

  title.textContent = office.title;
  subtitle.textContent = office.subtitle;

  office.services.forEach((code) => {
    
    let service = services.find(service => service.code === code);
    let serviceItemClone = serviceItemTemplate.content.cloneNode(true);
    let serviceLabel = serviceItemClone.querySelector(".service__label");
    let serviceList = clone.querySelector(".service-list");     

    serviceLabel.textContent = service.name;
    serviceList.appendChild(serviceItemClone);
  })

  delailsContent.appendChild(clone);
}





