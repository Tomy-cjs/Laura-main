//Feita por Ton/Tomy
require('./datab/armazenamento/env/info')
const { 
default: WAConnection,
MessageType,
Presence,
GroupSettingChange,
WA_MESSAGE_STUB_TYPES,
WAContextInfo,
Mimetype,
MediaPathMap,
MimetypeMap,
relayWAMessage,
makeInMemoryStore,
useMultiFileAuthState,
BufferJSON, 
DisconnectReason, 
downloadMediaMessage,
downloadAndSaveMediaMessage,
fetchLatestBaileysVersion,
downloadContentFromMessage,
generateWAMessageFromContent,
Browser,
proto,
delay
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino') 
const { Boom } = require('@hapi/boom')
const fetch = require('node-fetch')
const chalk = require('chalk')
const { color } = require('./datab/lib/cores')
const moment = require('moment-timezone')
const hora = moment.tz('America/Sao_Paulo').format('HH:mm:ss')
const data = moment.tz('America/Sao_Paulo').format('DD/MM/YY')
const speed = require('performance-now')
const { banner, getGroupAdmins, getBuffer, getRandom, getExtension } = require('./datab/lib/funções')
const { fetchJson } = require('./datab/lib/fetcher')
const configurações = JSON.parse(fs.readFileSync('./datab/armazenamento/env/info.json'))
const registros = JSON.parse(fs.readFileSync('./datab/armazenamento/env/registros.json'))
const imagens = JSON.parse(fs.readFileSync('./datab/armazenamento/imagens/imagem.json'))

// Definições
prefixo = configurações.prefixo
nomeBot = configurações.nomeBot
nomeDono = configurações.nomeDono
numeroDono = configurações.numeroDono
logo = imagens.logo

// Funções importadas
const { climaDl } = require('./datab/js/clima')
const { mediafireDl } = require('./datab/js/mediafire')
const { pinterest } = require('./datab/js/srch')

// Funções módulos
let girastamp = speed()
let latensi = speed() - girastamp

// Contato do dono
const vcard = 'BEGIN:VCARD\n'
+ 'VERSION:3.0\n' 
+ 'FN:Ton\n' // Nome completo
+ 'ORG:Lwa Company;\n' // A organização do contato
+ 'TEL;type=CELL;type=VOICE;waid=558981457096:+55 89 8145 7096\n' // WhatsApp ID + Número de telefone
+ 'END:VCARD' // Fim do ctt

// Início da conexão
async function starts() {
const store = makeInMemoryStore({ logger: P().child({ level: 'debug', stream: 'store' }) })

// Conexão com o qr
const loadState = () => {
var state
try {
const value = JSON.parse(fs.readFileSync('./datab/qr-code', { encoding: 'utf-8' }), BufferJSON.reviver)
state = { 
creds: value.creds, 
keys: initInMemoryKeyStore(value.keys) 
}
} catch {}
return state
}

const { state, saveCreds } = await useMultiFileAuthState('./datab/qr-code')
console.log(banner.string)
console.log()
console.log()
console.log('\033[1;32mLaura MD conectanda!!\x1b[1;37m')
console.log('\033[1;30mInfo\x1b[1;37m', '\x1b[0;34m Os: Baileys\x1b[1;37m')
console.log('\033[1;30mInfo\x1b[1;37m', '\x1b[0;34m Versão: 1.0\x1b[1;37m')
console.log('\033[1;30mInfo\x1b[1;37m', `\x1b[0;34m Dev: ${nomeDono}\x1b[1;37m`)
console.log('\033[1;30mBoa Sorte!\x1b[1;37m')
console.log()
const conn = WAConnection({
logger: P({ level: 'silent'}),
auth: state,
printQRInTerminal: true
})
store.bind(conn.ev)

conn.ev.on('chats.set', () => {
// pode usar 'store.chats' como quiser, mesmo depois que o soquete morre
// 'chats' => uma instância keyedDB
console.log('Tem conversas', store.chats.all())
})
conn.ev.on('contacts.set', () => {
console.log('Tem contatos', Object.values(store.contacts))
})
conn.ev.on('creds.update', saveCreds)


// Chat update
// Ouvir quando as credenciais auth é atualizada
conn.ev.on('messages.upsert', async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 
await conn.readMessages(info.key.remoteJid, info.key.participant, [info.key.id])
if (info.key && info.key.remoteJid == 'status@broadcast') return
const altpdf = Object.keys(info.message)
const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]
global.prefixo

const content = JSON.stringify(info.message)
const from = info.key.remoteJid

selectedButton = (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : ''

// Body
var body = (type === 'conversation') ?
info.message.conversation : (type == 'imageMessage') ?
info.message.imageMessage.caption : (type == 'videoMessage') ?
info.message.videoMessage.caption : (type == 'extendedTextMessage') ?
info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ?
info.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ?
info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ?
info.message.templateButtonReplyMessage.selectedId : ''
const args = body.trim().split(/ +/).slice(1)
const isCmd = body.startsWith(prefixo)
const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null
const argsButton = selectedButton.trim().split(/ +/)

// Bady
bady = (type === 'conversation') ? info.message.conversation : (type == 'imageMessage') ? info.message.imageMessage.caption : (type == 'videoMessage') ? info.message.videoMessage.caption : (type == 'extendedTextMessage') ? info.message.extendedTextMessage.text : (info.message.listResponseMessage && info.message.listResponseMessage.singleSelectReply.selectedRowId) ? info.message.listResponseMessage.singleSelectReply.selectedRowId: ''

// Budy
budy = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

//===

button = (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedDisplayText : ''
button = (type == 'buttonsResponseMessage') ? info.message.buttonsResponseMessage.selectedButtonId : ''
listMessage = (type == 'listResponseMessage') ? info.message.listResponseMessage.title : ''

var pes = (type === 'conversation' && info.message.conversation) ? info.message.conversation : (type == 'imageMessage') && info.message.imageMessage.caption ? info.message.imageMessage.caption : (type == 'videoMessage') && info.message.videoMessage.caption ? info.message.videoMessage.caption : (type == 'extendedTextMessage') && info.message.extendedTextMessage.text ? info.message.extendedTextMessage.text : ''

bidy =  budy.toLowerCase()

// Enviar gifs
const enviargif = (videoDir, caption) => {
conn.sendMessage(from, {
video: fs.readFileSync(videoDir),
caption: caption,
gifPlayback: true
})
}

// Enviar imagens
const enviarImg = (imageDir, caption) => {
conn.sendMessage(from, {
image: fs.readFileSync(imageDir),
caption: caption
})
}

// Envia imagens com botão
const enviarImgB = async (id, img1, text1, desc1, but = [], vr) => {
buttonMessage = {
image: {url: img1},
caption: text1,
footerText: desc1,
buttons: but,
headerType: 4
}
conn.sendMessage(id, buttonMessage, {quoted: vr})
}

// Enviar figs
const enviarfig = async (figu, tag) => {
bla = fs.readFileSync(figu)
conn.sendMessage(from, {sticker: bla}, {quoted: info})
}

const getFileBuffer = async (mediakey, MediaType) => { 
const stream = await downloadContentFromMessage(mediakey, MediaType)

let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
const arg = body.substring(body.indexOf(' ') + 1)
const argss = body.split(/ +/g)
const testat = body
const ants = body
const isGroup = info.key.remoteJid.endsWith('@g.us')
const tescuk = ['0@s.whatsapp.net']
const q = args.join(' ')
const sender = isGroup ? info.key.participant : info.key.remoteJid
const pushname = info.pushName ? info.pushName : ''
const isRegistro = registros.includes(sender)
const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupDesc = isGroup ? groupMetadata.desc : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const text = args.join(' ')

resposta = {
espere: '*🧸 Aguarde um momentinho. tá bom? ⚘*',
grupo: '*🧸 Este comando só pode ser utilizado em grupo. 🎲*',
privado: '*🧸 Esse comando só pode ser usado no privado. 🧩*',
adm: '*🧸 Somente admins pode utilizar esse comando. ⭐*',
botadm: '*🧸 Este comando só pode ser utilizado quando eu me tornar administradora. 🌙*',
registro: `*🧸Olá ${pushname}, não encontrei seu login fassa registro utilizado ${prefixo}rg. ☺*`,
norg: '*🧸 Oops, não e possível ter mais de um registro. 😅*',
erro: '*🧸 Ops, deu erro no comando...*',
dono: '*🧸 Este é um recurso especial para o meu Dono. 🧑🏻‍💻*'
}

// Selos de verificado
const ContatVR = {key : {participant : '0@s.whatsapp.net'},message: {contactMessage:{displayName: `${pushname}`}}}
const LiveVR = {key : {participant : '0@s.whatsapp.net'},message: {liveLocationMessage: {}}}
const ImagenVR = {key : {participant : '0@s.whatsapp.net'},message: {imageMessage: {}}}
const VideoVR = {key : {participant : '0@s.whatsapp.net'},message: {videoMessage: {}}}
const DocVR = {key : {participant : '0@s.whatsapp.net'},message: {documentMessage:{}}}

// Consts dono/adm etc...
const quoted = info.quoted ? info.quoted : info
const mime = (quoted.info || quoted).mimetype || ""
const numeroBot = conn.user.id.split(':')[0]+'@s.whatsapp.net'
const isBot = info.key.fromMe ? true : false
const isBotGroupAdmins = groupAdmins.includes(numeroBot) || false
const isGroupAdmins = groupAdmins.includes(sender) || false 
const argis = bidy.trim().split(/ +/)
const isOwner = sender.includes(numeroDono) 
const enviar = (texto) => {
conn.sendMessage(from, { text: texto }, {quoted: info}) }

// Consts isQuoted
const isImage = type == 'imageMessage'
const isVideo = type == 'videoMessage'
const isAudio = type == 'audioMessage'
const isSticker = type == 'stickerMessage'
const isContact = type == 'contactMessage'
const isLocation = type == 'locationMessage'
const isProduct = type == 'productMessage'
const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage')
typeMessage = body.substr(0, 50).replace(/\n/g, '')
if (isImage) typeMessage = 'Image'
else if (isVideo) typeMessage = 'Video'
else if (isAudio) typeMessage = 'Audio'
else if (isSticker) typeMessage = 'Sticker'
else if (isContact) typeMessage = 'Contact'
else if (isLocation) typeMessage = 'Location'
else if (isProduct) typeMessage = 'Product'
const isQuotedMsg = type === 'extendedTextMessage' && content.includes('textMessage')
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedContact = type === 'extendedTextMessage' && content.includes('contactMessage')
const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage')
const isQuotedProduct = type === 'extendedTextMessage' && content.includes('productMessage')

// Mensagems do console
if (!isGroup && isCmd) console.log('\033[1;31m~\x1b[1;37m>', '[\x1b[0;31mComando\x1b[1;37m]', hora, color(comando), 'de ', color(sender.split('@')[0]))

if (!isGroup && !isCmd && !info.key.fromMe) console.log('\033[1;31m~\x1b[1;37m>', '[\033[0;34mMensagem\x1b[1;37m]', 'de ', color(sender.split('@')[0]))

if (isCmd && isGroup) console.log('\033[1;31m~\x1b[1;37m>', '[\x1b[0;31mComando\x1b[1;37m]', hora, color(comando), 'de ', color(sender.split('@')[0]), 'Gp: ', color(groupName))

if (!isCmd && isGroup && !info.key.fromMe) console.log('\033[1;31m~\x1b[1;37m>', '[\033[0;34mMensagem\x1b[1;37m]',  'de ', color(sender.split('@')[0]), 'Gp: ', color(groupName))

// Começo dos comandos com prefix
switch(comando) {

case 'registrar':
case 'rg':
if (isRegistro) return enviar(resposta.norg)
try {
registros.push(sender)
fs.writeFileSync('./datab/armazenamento/env/registros.json', JSON.stringify(registros))
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
await conn.sendMessage(from, { react: { text: '✅', key: info.key }})    
await delay(3000)
conn.sendMessage(sender, { text: `_*Olá ${pushname}, Seu registro foi efetuado com sucesso. 😉*_`}, {quoted: info})
break

case 'perfil':
if (!isRegistro) return enviar(resposta.registro)
try {
ppimg = await conn.profilePictureUrl(`${sender.split('@')[0]}@s.whatsapp.net`, 'image')
} catch(e) {
ppimg = logo
}
perfil = await getBuffer(ppimg)
enviar(resposta.espere)
try {
conn.sendMessage(from, {
image: perfil,
caption: `┏━❒ 「 *Seu Perfil* 」 ❒
┃ *🧸‍ Nome:* ${pushname}
┃ *🧩 Número:* @${sender.split('@')[0]}
┃ *🔖 Presença:* Online
┃ *☕ Registros:* ${registros.length}
┃ *📞 Plataforma:* ${info.key.id.length > 21 ? 'Android' : info.key.id.substring(0, 2) == '3A' ? 'IOS' : 'WhatsApp web'}
┗━❏`
}, {quoted: ContatVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'attp': {
if (!isRegistro) return enviar(resposta.registro)
sections = [{
title: "Laura - MD",
rows: [
 {title: "🧸 Estilo 1 ⚘", rowId: `${prefixo}ttp ${q}`},
 {title: "🧸 Estilo 2 ⚘", rowId: `${prefixo}attp2 ${q}`},   
 {title: "🧸 Estilo 3 ⚘", rowId: `${prefixo}attp3 ${q}`},
 {title: "🧸 Estilo 4 ⚘", rowId: `${prefixo}attp4 ${q}`},
 {title: "🧸 Estilo 5 ⚘", rowId: `${prefixo}attp5 ${q}`},
 {title: "🧸 Estilo 6 ⚘", rowId:`${prefixo}attp6 ${q}`},
]
},
]
 
listMessage7 = {
  text: `Resultados para [ ${q} ]`,
  footer: "",
  title: "🔥 Estilos de attp.",
  buttonText: "🧸 Escolher 🌺",
  sections
}
await conn.sendMessage(from, listMessage7, {quoted: info})
}
break

case 'ttp':
if (!isRegistro) return enviar(resposta.registro)
if (q < 1) return enviar('Vou fazer fig invisível agora é?')
ttp = encodeURI(`https://api.brizaloka-api.tk/ttp/attp1?apikey=brizaloka&text=${q}`)
ttpp = await getBuffer(ttp)
enviar(resposta.espere)
try {
conn.sendMessage(from, {sticker: ttpp}, {quoted: ContatVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'attp2':
case 'attp3':
case 'attp4':
case 'attp5':
case 'attp6':
if (!isRegistro) return enviar(resposta.registro)
if (q < 1) return enviar('Vou fazer fig invisível?')
ttp = encodeURI(`https://api.brizaloka-api.tk/ttp/${comando}?apikey=brizaloka&text=${q}`)
attp = await getBuffer(ttp)
enviar(resposta.espere)
try {
conn.sendMessage(from, {sticker: attp}, {quoted: ContatVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'clima':
if (!isRegistro) return enviar(resposta.registro)
if (q < 3) return enviar('Insira o nome da sua cidade.')
try {
res = await climaDl(q)
desc = `🌞 Clima 🌥\n\n🌇 Local: ${res[0].lugar}\n🌐 Continente: ${res[0].continente}\n☁️ Clima: ${res[0].clima}\n🌡 Temperatura: ${res[0].temperatura}\n🔥 Temperatura Max: ${res[0].temperatura_max}\n❄ Temperatura Minima: ${res[0].temperatura_minima}\n🌘 Visibilidade: ${res[0].visibilidade}\n🌧 Umidade: ${res[0].umidade}\n🌫 Velocidade Vento: ${res[0].vento}`
conn.sendMessage(from, { text: desc }, {quoted: info})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'pinterest': {
if (!isRegistro) return enviar(resposta.registro)
if (args.length < 1) return enviar(`Exemplo:\n ${prefixo + comando} anime`)
anu = await pinterest(q)
result = anu[Math.floor(Math.random() * anu.length)]
let buttons = [
{
buttonId: `${prefixo}pinterest ${q}`, 
buttonText: 
{
displayText: '☕ Próxima imagem ⚘'
},
type: 1
}
]
let buttonMessage4 = {
image: { url: result },
caption: `🧸 Olá ${pushname}, aqui está sua imagem 🎲`,
footer: '',
buttons: buttons,
headerType: 4
}
conn.sendMessage(from, buttonMessage4, { quoted: ImagenVR })
}
break

case 'mediafire':
if (!isRegistro) return enviar(resposta.registro)
if(args.length == 0) return enviar('*🧸 Oops, coloque o link..*')
try {
enviar(resposta.espere)
let media = await mediafireDl(q)
conn.sendMessage(from, { document: { url: media[0].link }, fileName: media[0].nama, mimetype: media[0].mime }, {quoted: DocVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'toimg':
if (!isRegistro) return enviar(resposta.registro)
if (!isQuotedSticker) return enviar('*🧸 Marca uma figurinha*')
buff = await getFileBuffer(info.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage, 'sticker')
enviar(resposta.espere)
try {
conn.sendMessage(from, {image: buff}, {quoted: ContatVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'reagir':
if (!isRegistro) return enviar(resposta.registro)
{
conn.sendMessage(from, { react: { text: '🧸', key: info.key }})               
}
break

case 'programado':
case 'suporte':
case 'dono':
if (!isRegistro) return enviar(resposta.registro)
enviar(resposta.espere)
await delay(5000)
try {
conn.sendMessage(sender, { contacts: { displayName: `${nomeDono}`, contacts: [{ vcard }]
}})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'ping':
if (!isRegistro) return enviar(resposta.registro)
enviar(resposta.espere)
enviar(`Velocidade: ${latensi.toFixed(4)}`)
break

case 'executar':
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
if (args.length < 1) return enviar('Vou executar o vento?')
try {
ev = body.slice(comando.length + 2)
JSON.stringify(eval(ev.replace('await', '')))
} catch(e) {
enviar(e)
console.log(e)
}
break

case 'tag':
case 'hidetag':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (args.length < 1) return enviar('*🧸 Diga oque vou citar...*')
if (!groupAdmins) return enviar(resposta.adm)
value = body.slice(9)
group = await conn.groupMetadata(from)
member = group['participants']
mem = []
member.map( async adm => {
mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
options = {
text: value,
mentions: mem,
quoted: info
}
conn.sendMessage(from, options)
break

case 'enquete':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!isGroupAdmins) return enviar(resposta.adm)
if(q < 0) return enviar(`Exemplo: ${prefixo + comando} Fui desenvolvenda pelo Ton?`)
enquete = generateWAMessageFromContent(from, proto.Message.fromObject({
pollCreationMessage: {
options: [
{ optionName: 'Sim'},
{ optionName: 'Não'},
{ optionName: 'Provavelmente Sim'}, 
{ optionName: 'Provavelmente Não'}
],
name: `${q}`,
selectableOptionsCount: 0
}
}), { userJid: from })
await conn.relayMessage(from, enquete.message, { messageId: enquete.key.id})
break

case 'convite':
case 'entra':
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
if(q < 0) return enviar('*🧸 Oops, insira o link do grupo.*')
try {
let linkge = args[0].split('https://chat.whatsapp.com/')[1]
await conn.groupAcceptInvite(linkge)
delay(5000)
enviar('🧸 Okay, irei entra no grupo. ☁️')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'sair':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!isOwner) return enviar(resposta.dono)
enviar('*🧸 Okay, irei sair do grupo. 🙁*')
delay(5000)
try {
await conn.groupLeave(from)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'bloquear':
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
if (q < 1) return enviar('Vou bloquear o vento?')
let userb = q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await conn.sendMessage(from, { react: { text: '✅', key: info.key }})
try {
await conn.updateBlockStatus(userb, 'block')
} catch(e) {
enviar(resposta.erro)
console.log(e)
}
break

case 'desbloquear':
if (!isRegistro) return enviar(resposta.registro)
if (!isOwner) return enviar(resposta.dono)
if (q < 1) return enviar('Vou desbloquear o teu c*?')
let userd = q.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await conn.sendMessage(from, { react: { text: '✅', key: info.key }})    
try {
await conn.updateBlockStatus(userd, 'unblock')
} catch(e) {
enviar(resposta.erro)
console.log(e)
}
break

case 'gplink':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
const linkgp = await conn.groupInviteCode(from)
conn.sendMessage(from, { text: `🏷 CHAT 🌺 *${groupName}*\n\n🧸 Total Adms: ${groupAdmins.length}\n☁️ Total Membros: ${groupMembers.length}\n🔗 Link: ${linkgp}`}, {quoted: ContatVR})
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'resetarlink':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await conn.groupRevokeInvite(from)
enviar('🧸 Link de convite resetado com sucesso 🤭')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'gp':
case 'grupo':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
if (q == 'abrir') {
await conn.groupSettingUpdate(from, 'not_announcement')
enviar('🧸 Grupo aberto com sucesso 💣')
}
if (q == 'fechar') {
await conn.groupSettingUpdate(from, 'announcement')
enviar('🧸 Grupo fechado com sucesso 😣')
}
if (q == 'livrar') {
await conn.groupSettingUpdate(from, 'unlocked')
enviar('🧸 Grupo livre com sucesso 🌺')
}
if (q == 'limitar') {
await conn.groupSettingUpdate(from, 'locked')
enviar('🧸 Grupo limitado com sucesso 😒')
}
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'infogp':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
enviar(`
🧸 Nome : ${groupName}
🌺 Descrição : ${groupDesc}
🔥️ Id : ${from}
🗓 Data : ${data}
🧭 Horário : ${hora}
`)
break

case 'mudardk':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await conn.groupUpdateDescription(from, `${q}`)
enviar('🧸 Descrição alterada com sucesso 🔥')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'mudarnm':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
await conn.groupUpdateSubject(from, `${q}`)
enviar('🧸 Nome alterado com sucesso 🌺')
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'rebaixar':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (args.length < 1) return enviar('Digite o número, animal')
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
conn.groupParticipantsUpdate(from, [`${q}@s.whatsapp.net`], 'demote')
enviar(`*🧸 Vixi @${q}. Você foi rebaixado a membro comum. 🤭*`)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

case 'promover':
if (!isRegistro) return enviar(resposta.registro)
if (!isGroup) return enviar(resposta.grupo)
if (!groupAdmins) return enviar(resposta.adm)
if (args.length < 1) return enviar('Cade o número, mongolóide')
if (!isBotGroupAdmins) return enviar(resposta.botadm)
try {
conn.groupParticipantsUpdate(from, [`${q}@s.whatsapp.net`], 'promote')
enviar(`*🧸 Parabéns @${q}. Você foi promovido a adm. ☺*`)
} catch(e) {
console.log(e)
enviar(resposta.erro)
}
break

default:

// Comandos sem prefix
switch(testat){
}

// Resposta quando o comando não é encontrado
if (isCmd){
enviar('*O comando não foi encontrado... 😣*')
await conn.sendMessage(from, { react: { text: '💣', key: info.key }})     
}

if (messagesC == 'corno'){
tujuh = fs.readFileSync('./datab/armazenamento/audios/corno.mp3')
await conn.sendMessage(from, {audio: tujuh, mimetype: 'audio/mp4', ptt:true}, {quoted: ContatVR})
}

}

} catch (erro) {
console.log(erro)
}})

conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update

if(connection === 'close') {
console.log('\033[1;30mConexão resetada.\x1b[1;37m')
var shouldReconnect = (lastDisconnect.error.Boom)?.output?.statusCode !== DisconnectReason.loggedOut  

if(connection === 'connecting') {
console.log('\033[1;30mRefazendo conexão...\x1b[1;37m')

if(connection === 'open') {
console.log('\033[1;32mLaura 1.0 conectanda ✓\x1b[1;37m')

starts()
}}}

if(update.isNewLogin) {
starts()
}})}
starts()