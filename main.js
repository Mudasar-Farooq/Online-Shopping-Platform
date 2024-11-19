// This file is for front-end java script

async function main() {
// Fun1:
// Hero section image changing
function main_imgs() {
    let img_arr = ["main.jpg", "main2.png", "main3.png", "main4.png", "main5.png"], i = 0;
    let main_img = document.querySelector(".main-img");
    setInterval(() => {
        if (main_img)
            main_img.src = `imgs/${img_arr[i]}`;
        i = (i + 1) % img_arr.length;
    }, 4000);
}

// Fun2:
// fetching the data

let fth = await fetch('./api/products.json')
let products = await fth.json();

// getting the template and cards
let sec = document.querySelector(".sec");
let temp = document.querySelector(".temp");


// Fun3:
// generate cards
function put_data() {
    if (!products)
        return false;

    products.forEach(pr => {
        const { id, name, type, brand, price, stock, des1,des2, img } = pr;
        // getting the structure from temp and after modyfing inserting into sec
        if (temp != null) {
            let nw_card = document.importNode(temp.content, true);
            nw_card.querySelector(".type").innerText = type;
            nw_card.querySelector(".img").src = img;
            nw_card.querySelector(".name").innerText = name;
            nw_card.querySelector(".des").innerText = des1;
            nw_card.querySelector(".name").innerText = name;
            nw_card.querySelector(".dis_price").innerText = `Rs. ${price}\\-`;
            nw_card.querySelector(".act_price").innerText = `Rs. ${price * 2}\\-`;
            if (nw_card.querySelector(".productStock"))
                nw_card.querySelector(".productStock").innerText = stock;

            sec.appendChild(nw_card);
        }

    });

}


// Fun3:
// inc dec function
function inc_dec() {
    let qty = document.querySelectorAll(".quantity");
    let add = document.querySelectorAll(".add");
    let remove = document.querySelectorAll(".remove");

    for (let i = 0; i < qty.length; i++) {
        qty[i].dataset.cnt = 1; // Step 1: Initializing data attribute as 1 for all qty

        add[i].addEventListener("click", () => {
            qty[i].dataset.cnt = parseInt(qty[i].dataset.cnt) + 1; // Step 2: Increase count by 1
            qty[i].innerText = qty[i].dataset.cnt; // Step 4: Update displayed text
        });

        remove[i].addEventListener("click", () => {
            let count = parseInt(qty[i].dataset.cnt) - 1; // Step 5: Decrease count by 1
            count = count <= 0 ? 1 : count; // Step 6: Ensure count is at least 1
            qty[i].dataset.cnt = count; // Step 7: Update data attribute
            qty[i].innerText = count; // Step 8: Update displayed text
        });
    }
}


// adding click functionality on a single card to go on its detail on card.html
function see_detail() {
    if (window.location.pathname.includes('index.html')) {
        let card = document.getElementsByClassName("card");
        for (let i = 0; i < card.length; i++) {
            card[i].addEventListener("click", () => {
                console.log("hyy");
                const type = products[i].type;
                const imgsrc = products[i].img;
                const name = products[i].name;
                const des = products[i].des2;
                const productStock = products[i].stock;
                const price= products[i].price;
                console.log(type, imgsrc, name, des);

                if (type && imgsrc && name && des && productStock && price) {
                    const params = new URLSearchParams({
                        type: type,
                        imgsrc: imgsrc,
                        name: name,
                        des: des,
                        productStock: productStock,
                        price: price,
                        // for knowing index
                        index: i
                    });
                    console.log(i, type, imgsrc, name, des, productStock);

                    // going on next webpage by giving the particular card information
                    window.location.href = `card.html?${params.toString()}`;
                }
            });
        }
    }

    // JS for the the clicked card on the next card.html page that how it gets the info from upcoming
    // click req
    if (window.location.pathname.includes('card.html')) {
        const params = new URLSearchParams(window.location.search);
        let type = params.get("type");
        const imgsrc = params.get("imgsrc");
        const name = params.get("name");
        const des = params.get("des");
        const productStock = params.get("productStock");
        const index = params.get("index");
        const price= params.get("price");

        // assignig to elements
        document.querySelector(".separateimg").src = imgsrc;
        document.querySelector(".type").innerText = type;
        document.querySelector(".name").innerText = name;
        document.querySelector(".des").innerText = des;
        document.querySelector(".dis_price").innerText=`Rs. ${price}\\-`;
        document.querySelector(".act_price").innerText=`Rs. ${price *2}\\-`;
        document.querySelector(".productStock").innerText = productStock;

        // adding addtocart fuctionality
        add_to_cart(document.querySelector(".cart"), index);

        console.log(index, type, imgsrc, name, des);
    }

}

// add to cart function
function add_to_cart(cart, i) {

    let card = document.querySelectorAll(".card");
    if (cart) {
        cart.addEventListener("click", async () => {
            const { id, name, type, brand, price, stock, des, img } = products[i];
            let response = await fetch('http://localhost:3007/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,  // Send the necessary product details
                    Name: name,
                    price: price,
                    quantity: Number(document.querySelector(".quantity").innerText)
                }),
            });
            const data = await response.json();

            // just getting the messege from server whether it is stored or not?
            if (response.ok) {
                location.reload();
                alert(data.message);
            }
            else
                alert('Error: ' + data.message);
        })
    }
}



// getting all the data from db which is added into cart
async function get_data() {
    let response = await fetch('http://localhost:3007/get-data');
    let data = await response.json();
    console.log(data);
    // changing the value in main cart

    document.querySelector(".main_cart").innerText = data.length;

    let hor_card = document.querySelector(".hor_card");
    let main2 = document.querySelector(".main2");
    let total = 0;
    let sub_total = 0;
    for (let i = 0; i < data.length; i++) {
        const { id, Name, price, quantity } = data[i];
        // getting the structure from hor_data and after modyfing inserting into main2
        // if (hor_card) {
        let show_card = document.importNode(hor_card.content, true);
        show_card.querySelector(".type2").innerText = products[id - 1].type;
        show_card.querySelector(".img2").src = products[id - 1].img;
        console.log(products[id-1].img);
        total = price * quantity;
        show_card.querySelector(".act_price2").innerText = `Rs. ${total}\\-`;
        show_card.querySelector(".quantity").innerText = quantity;
        show_card.querySelector(".name").innerText = Name;
        main2.appendChild(show_card);
        // }
        // Total price calculation:
        sub_total += total;

        let removess = document.querySelectorAll(".cart2");
        console.log(removess);
        if (removess) {
            // remove functionality
            removess[i].addEventListener("click", async () => {
                let response2 = await fetch('http://localhost:3007/remove', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: id  // Send the necessary product details
                    }),
                });
                // removing the hor_card from frontend also
                if(response2.ok){
                   location.reload();
                }
            })
        }
    }

    document.querySelector(".sub_total").innerText = `Rs. ${sub_total}\\-`;
    let tax = sub_total * (5 / 100);
    document.querySelector(".tax").innerText = `Rs. ${tax}\\-`;
    let final_total = sub_total + tax;
    document.querySelector(".final_total").innerText = `Rs. ${final_total}\\-`;
}


// function for payment method selection
function payment_mthd(){
    if(window.location.pathname.includes('addtocart.html')){
    const paymentMethod=document.querySelector(".slt").value;
    const online=document.querySelector("#online");
    const ondoor=document.querySelector(".ondoor");
    console.log(paymentMethod);
    if(paymentMethod==='Online_payment'){
        online.style.display='block';
    }
    else{
        online.style.display='none';
    }

    // on clicking the place_order button select all the orders
    //  (for now we are deleting them from db)

    document.querySelector(".payment2").addEventListener("click",async ()=>{
        let response3 = await fetch('http://localhost:3007/remove-all', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        let data=await response3.json();
        // removing the hor_card from frontend also
        if(response2.ok){
           location.reload();
           alert(data.message);
        }
    });
}
}


function allfuncall() {
    main_imgs();
    put_data();
    see_detail();
    inc_dec();
    add_to_cart();
    get_data();
    payment_mthd();

}

allfuncall();

}

main();
