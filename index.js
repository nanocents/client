let clientid =
    "c0fc4e121c6db2c9f8810d72a9b624bb:ebdd21ff0183f881581539c0063753d7f18c056128279539bbedc17f6e0a21dec6cf7f8e75cfefb940f4fd3ce31445fb0770124fa73f53eb67df627ca99c7113";
const urlpath = `https://nanocents.com/webpurchase`;

const donate = async (id) => {
    let furl = itemToPath({ item: id, ...item });
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
        // clear the user from storage
        return;
    }

    if (st.status === "ok") {
        console.log("STATUS OKAY");
        st.data.map((i) => {
            console.log("i.item is %s", i.item);
            let z = document.getElementById(i.item);
            if (z !== null) {
                replaceit(i.item);
            } else {
                console.log("z is null for %s", i.item);
            }
        });
    }
})(clientid);

const item = { item: 29, amount: 10, desc: "Donation" };
