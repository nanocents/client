let clientid =
    "c0fc4e121c6db2c9f8810d72a9b624bb:ebdd21ff0183f881581539c0063753d7f18c056128279539bbedc17f6e0a21dec6cf7f8e75cfefb940f4fd3ce31445fb0770124fa73f53eb67df627ca99c7113";
const urlpath = `https://nanocents.com/webpurchase`;

const items = {
    donate: { amount: 10, desc: "Donation" },
    gatsby: { amount: 5, desc: "Gatsby", replacement: "You voted for Gatsby!" },
};
const purchase = async (id) => {
    let purchase = items[id];
    let furl = itemToPath({ item: id, ...purchase });
    // console.log("FURL %s", furl);
    location.assign(furl);
};
const itemToPath = (purchase) => {
    var array = new Uint8Array(1);
    window.crypto.getRandomValues(array);
    let txid = array[0];
    let item = `amount=${purchase.amount}&desc=${purchase.desc}&item=${purchase.item}`;
    let furl = `${urlpath}?client=${clientid}&txid=${txid}&${item}`;
    return furl;
};

(async (clientid) => {
    let url = new URL(location);
    console.log("url " + url);

    let furl = `https://nanocents.com/clientapi/getwebpurchases?client=${clientid}`;
    console.log("fetching %s", furl);
    let response = await fetch(furl, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) {
        console.log("response NOT OK");
        console.log(response.status);
        return;
    }
    let type = response.headers.get("content-type");
    if (!type || !type.includes("application/json")) {
        console.log("bad type going to webpurchase");
        return;
    }
    let st = await response.json();
    console.log("GOT ST ", st);
    if (!!st.err) {
        console.log("Error getting purchases:` %s", st.err);
        return;
    }

    if (st.status === "ok") {
        st.data.map((i) => {
            console.log("i.item is %s", i.item);
            let z = document.getElementById(i.item);
            if (z !== null && z.replacement) {
                console.log("FOUND REPLACE ABLE");
                elementreplace(i.item, z.replacement);
            }
        });
    }
})(clientid);

const elementreplace = (elid, replacement) => {
    let el = document.getElementById(elid);
    let parentDiv = el.parentNode;
    let elnew = document.createElement("p");
    elnew.classList.add("was-button");
    let t = document.createTextNode(replacement);
    elnew.appendChild(t);
    parentDiv.replaceChild(elnew, el);
};
