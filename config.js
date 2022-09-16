const config = {
    application: {
        cors: {
            server: [
                {
                    origin: "localhost:", //servidor que deseas que consuma o (*) en caso que sea acceso libre
                    credentials: true
                }
            ]
        }
}
}