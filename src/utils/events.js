// 编辑器自定义事件
const events = {
    redirect(url) {
        if (url) {
            window.location.href = url
        }
    },

    alert(msg) {
        if (msg) {
            // eslint-disable-next-line no-alert
            alert(msg)
        }
    },

    console(msg) {
        if (msg) {
            console.log(msg)
        }
    },
}

const mixins = {
    methods: events,
}

const eventList = [
    {
        key: 'alert',
        label: 'alert 事件',
        event: events.alert,
        param: '',
    },
    {
        key: 'redirect',
        label: '跳转事件',
        event: events.redirect,
        param: '',
    },
    {
        key: 'console',
        label: 'console 事件',
        event: events.console,
        param: '',
    },
]

export {
    mixins,
    events,
    eventList,
}