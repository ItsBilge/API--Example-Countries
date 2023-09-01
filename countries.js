document.querySelector("#btnSearch").addEventListener("click", () => {
  let text = document.querySelector("#txtSearch").value;
  document.querySelector("#details").style.opacity = 0;
  displayCountry(text); // kullanıcının yazdığı ülke ismini displayCountry fonksiyonuna gönderiyoruz.
});

// .....................PROMİSE YAPISI ........................................

// function displayCountry(country){
//     fetch('https://restcountries.com/v3.1/name/'+ country)
//         .then((response) => {
//             if(!response.ok){
//                 throw new Error("Ülke bulunamadı")
//             }
//             return response.json()
//         })
//         .then((data) => {
//             setCountry(data[0]);
//             const countries = data[0].borders;

//             if(!countries){
//                 throw new ReferenceError("Komşu ülkesi yok")
//             }

//             return fetch('https://restcountries.com/v3.1/alpha?codes=' + countries.toString())
//         })
//         .then((response) => response.json())
//         .then((data) => renderNeighbors(data))
//         .catch(err => renderError(err))
// };

// ......................async ve await kullanılarak.........................

async function displayCountry(country) {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/name/" + country
    ); //verileri çekeceğimiz api'nin url'sini response'de tuttuk.name sonrasında ülke ismi gelecek
    if (!response.ok) {
      throw new Error("Ülke bulunamadı");
    }
    const data = await response.json(); //responsenin json formatında olduğunu gösterdik
    setCountry(data[0]);

    const countries = data[0].borders; //borders(komşu ülke) bilgisi alındı.
    if (!countries) {
      throw new Error("Komşu ülkesi yok");
    }

    const response2 = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" + countries.toString()
    );
    const neighbors = await response2.json();

    renderNeighbors(neighbors);
  } catch (err) {
    renderError(err);
  }
}

// .................................. UZUN YOL (XMLHttpRequest ile)..........................
// function displayCountry(country){
//     const request = new XMLHttpRequest();

//     request.open('GET', 'https://restcountries.com/v3.1/name/'+ country);
//     request.send();

//     request.addEventListener('load', function(){
//         const data = JSON.parse(this.responseText);
//         setCountry(data[0]);

//         const countries = data[0].borders.toString();

//         const req = new XMLHttpRequest();
//         req.open('GET', 'https://restcountries.com/v3.1/alpha?codes=' + countries);
//         req.send();

//         req.addEventListener('load', function() {

//JSON parse kullanarak gelen bilgiyi dizi haline getirdik
//             const data = JSON.parse(this.responseText);
//             renderNeighbors(data);
//             console.log(data)
//         })
//     });
// };

function setCountry(data) {
  document.querySelector("#country-details").innerHTML = "";
  document.querySelector("#neighbors").innerHTML = "";

  let html = `
        <div class="col-4">
            <img src="${data.flags.png}" alt="" class="img-fluid">
        </div>
        <div class="col-8">
            <h3 class="card-title">${data.name.common}</h3>
            <br>
            <div class="row">
                <div class="col-4">Nüfus:</div>
                <div class="col-8">${(data.population / 1000000).toFixed(
                  1
                )} milyon</div>
            </div>
            <div class="row">
                <div class="col-4">Resmi Dili:</div>
                <div class="col-8">${Object.values(data.languages)}</div>
            </div>
            <div class="row">
                <div class="col-4">Başkent:</div>
                <div class="col-8">${data.capital[0]}</div>
            </div>
            <div class="row">
                <div class="col-4">Para Birimi:</div>
                <div class="col-8">${Object.values(data.currencies)[0].name} (${
    Object.values(data.currencies)[0].symbol
  })</div>
            </div>
        </div>
    `;

  document.querySelector("#details").style.opacity = 1;
  document.querySelector("#country-details").innerHTML = html;

  // Yukarıda oluşturulan html değişkeni için aşağıda for döngüsü kullanılarak farklı yok denendi, tercih edilebilir.
  // for(let country of data){
  //     const html = `
  //         <div class= "col-3">
  //             <div class = "card h-100">
  //                 <img src="${country.flags.png}" class = "card-img-top"
  //                 <div class= "card-body"
  //                     <h5 class="card-title"> ${country.name.common}</h5>
  //                 </div>
  //                 <ul class = "list-group list-group-flush">
  //                     <li class="list-group-item">Population: ${(country.population/ 1000000).toFixed(1)}</li>
  //                     <li class="list-group-item">Capital: ${country.capital[0]}</li>
  //                     <li class="list-group-item">Language: ${Object.values(country.languages)}</li>
  //                 </ul>
  //             </div>

  //         </div>
  //     `;
  //     document.querySelector(".container .row").insertAdjacentHTML("beforeend", html);
  // }
}

function renderNeighbors(data) {
  //Eğer input'a girilen ülkenin komşu ülkeleri varsa komşu ülkelerin ismini ve bayrağını ekranda gösteriyoruz (for döngüsü ile).
  let html = "";
  for (let country of data) {
    html += `
            <div class= "col-2 mt-2">
                <div class= "card">
                    <img src = "${country.flags.png}" class = "card-img-top">
                    <div class = "card-body">
                        <h6 class = "card-title">${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;
    document.querySelector("#neighbors").innerHTML = html;
  }
}

function renderError(err) {
  //Eğer hata alınırsa ekrana alert mesajı yazdırıyoruz.
  const html = `
        <div class = "alert alert-danger">
            ${err.message}
        </div>
    `;
  setTimeout(function () {
    document.querySelector("#errors").innerHTML = "";
  }, 3000); // alınan hata mesajı ekranda 3 sn kalıyor.
  document.querySelector("#errors").innerHTML = html;
}
