const iClient = require("instagram-private-api").V1;

iClient.Session.create("koruja.contato@gmail.com", {}, "koruja.contato@gmail.com", "krjknbx84902").then((session) => {
    iClient.Thread.getById(session, "messageid").then((thread) => {
        thread.broadcastText("Hello World!").then((threadWrapper) => {
            console.log(threadWrapper);
        });
    });
});