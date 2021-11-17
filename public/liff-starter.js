// document.addEventListener("load", function () {
//     console.log("window loaded")
//     liff.init({
//         liffId: '1656528096-W6qpn7m3',
//         // withLoginOnExternalBrowser: true,
//     }).then(() => {
//         window.alert("liff inited")
//         if (!liff.isLoggedIn()) {
//             liff.login();
//         }
//     }).catch((err) => {
//         console.log(err);
//     });
// });

console.log("load!!")
liff.init({
    liffId: '1656528096-W6qpn7m3',
    // withLoginOnExternalBrowser: true,
}).then(() => {
    console.log("liff inited")
    if (!liff.isLoggedIn()) {
        liff.login();
    }
    const idToken = liff.getDecodedIDToken();
    console.log(idToken);
}).catch((err) => {
    console.log(err);
});