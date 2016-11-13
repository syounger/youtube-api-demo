module.exports = {
    hostname: 'localhost',
    port: 3100,
    jwt: {
        secret: 'doreme'
    },
    youtube: {
        api: {
            url: 'https://www.googleapis.com/youtube/v3',
            key: 'AIzaSyB6MS6-4kasCTlL8pxcL5BT9DfLBTv1Vts'
        }
    },
    mongo: {
        host: 'localhost',
        port: '27017',
        user: '',
        pass: '',
        database: 'youtube'
    },
    api: {
        thumbnails: {
            width: 300
        }
    }
}