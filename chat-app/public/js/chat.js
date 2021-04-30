const socket = io()
//Elements
const $messageForm = document.querySelector('#message-form')
const sendLocation = document.querySelector('#send-location')
const $messageFormInput= $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplates = document.querySelector('#location-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

const autoscroll = () =>{
    // New message
    const $newMessages = $messages.lastElementChild

    //HEIGHT of the last message
    const newMessageStyles = getComputedStyle($newMessages)
    const newMessageMargin =parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessages.offsetHeight + newMessageMargin
    

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //How have i scrolled 
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('roomData', ({room, users})=>{
    const html = Mustache.render($sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


socket.on('locationMessage', (url) =>{
    console.log(url)
    const html = Mustache.render(locationTemplates,{
        username: url.username,
        url : url.url,
        createdAt : moment(url.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
        // disable

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message,(error)=>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        // enable
        if (error){
            return console.log(error)
        }
        console.log('message deivered successfully')
    })
})
sendLocation.addEventListener('click', ()=>{

    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    sendLocation.setAttribute('disabled', 'disabled')
   
   navigator.geolocation.getCurrentPosition((position)=>{
       
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
       
        },()=>{
            console.log('Location shared!')
            sendLocation.removeAttribute('disabled')
        })
   })

})
socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href = "/"
    }
})