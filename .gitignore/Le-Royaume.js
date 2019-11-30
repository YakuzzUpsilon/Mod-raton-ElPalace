const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
const ms =require('ms')
const warns = JSON.parse(fs.readFileSync('./warns.json'))
const mutes = JSON.parse(fs.readFileSync('./mutes.json'))
const bans = JSON.parse(fs.readFileSync('./bans.json'))
let prefix =process.env.PREFIXE

client.login(process.env.TOKEN)

 
/*Kick*/
client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + 'kick') {
       if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
       let member = message.mentions.members.first()
       let reason = args.slice(2).join(' ')
       if (!member) return message.channel.send("Membre introuvable.")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur.")
       if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur.")
       member.kick()
       if(!reason){
        message.channel.send('**' + member + '** a été exclu.')
        //member.guild.channels.get(process.env.LOGMOD).send(member + ' a été exclu.')
       }
       else{
        message.channel.send('**' + `${member}` + '** a été exclu pour' + reason + ".")
        //member.guild.channels.get(process.env.LOGMOD).send(member + ' a été exclu pour ' + reason +".")
       }
    }
})

/*Ban*/
client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'ban') {
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
       let member = message.mentions.members.first()
       let reason = args.slice(2).join(' ')
       if (!member) return message.channel.send("Membre introuvable.")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur.")
       message.guild.ban(member, reason)
       if(!reason){
        message.channel.send('**' + member + '** a été ban.')
        //member.guild.channels.get(process.env.LOGMOD).send(member + ' a été ban.')
       }
       else{
        message.channel.send('**' + member + '** a été ban pour ' + reason + ".")
        //member.guild.channels.get(process.env.LOGMOD).send(member + ' a été ban pour ' + reason + ".")
       }
    }
})

client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "clear") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
        let count = parseInt(args[1])
        if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer")
        if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide")
        if (count < 1 || count > 101) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100")
        message.channel.bulkDelete(count, true)
    }
 
    if (args[0].toLowerCase() === prefix + "mute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        let reason = args.slice(2).join(' ')
        if (!member) return message.channel.send("Membre introuvable.")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre.")
        if (!member.manageable) return message.channel.send("Je ne peux pas mute ce membre.")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            if(!reason){
                message.channel.send(member + ' a été mute.')
                //member.guild.channels.get(process.env.LOGMOD).send(`${member} a été mute.`)
            }else{
                message.channel.send(member + ' a été mute pour ' + reason + ".")
                //member.guild.channels.get(process.env.LOGMOD).send(`${member} a été mute pour ` + reason + ".")
            }
        }
        if(!reason){
            reason = "non spécifié"
        }
        if (!mutes[member.id]) {
            mutes[member.id] = []
        }
        mutes[member.id].unshift({
            reason: reason,
            mutetime: "",
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./mutes.json', JSON.stringify(mutes))
    }
})

client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLowerCase() === prefix + "warn") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Membre introuvable.")
        let reason = args.slice(2).join(' ')
        if(!reason){
            message.channel.send(member + " a été warn.")
            //member.guild.channels.get(process.env.LOGMOD).send(`${member} a été warn.`)
        }else{
            message.channel.send(member + " a été warn pour " + reason + ".")
            //member.guild.channels.get(process.env.LOGMOD).send(`${member} a été warn pour ` + reason + ".")
        }
        if(!reason){
            reason = "non spécifié"
        }
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
    }
})
 
client.on("message", function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    //unmute
    if (args[0].toLowerCase() === prefix + "unmute") {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if(!member) return message.channel.send("Membre introuvable.")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.")
        if(!member.manageable) return message.channel.send("Je ne pas unmute ce membre.")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
        message.channel.send(`le mute de ${member} a prit fin.`)
        //member.guild.channels.get(process.env.LOGMOD).send(`le mute de ${member} a prit fin.`)
    }
 
    //unwarn
    if (args[0].toLowerCase() === prefix + "unwarn") {
        let member = message.mentions.members.first()
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        if(!member) return message.channel.send("Membre introuvable")
        if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.")
        if(!member.manageable) return message.channel.send("Je ne pas unwarn ce membre.")
        if(!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.")
        warns[member.id].shift()
        fs.writeFileSync('./warns.json', JSON.stringify(warns))
        message.channel.send("Le dernier warn de " + member + " a été retiré.")
        //member.guild.channels.get(process.env.LOGMOD).send(`le dernier warn de ${member} a été retiré.`)
    }
})
    
client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLowerCase() === prefix + "tempmute") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Membre introuvable.")
        if (!member.manageable) return message.channel.send("Je ne peux pas mute ce membre.")
        let reason = args.slice(3).join(' ')
        let mutetime = args[2];
        if (!mutetime) return message.channel.send("Vous n'avez sélectionné de temps.")
        let muterole = message.guild.roles.find(role => role.name === 'Muted')
        if (muterole) {
            member.addRole(muterole)
            if(!reason){
                message.channel.send(`${member} a été mute ${mutetime}.`)
                //member.guild.channels.get(process.env.LOGMOD).send(`${member} a été mute ${mutetime}.`)
            }else{
                message.channel.send(`${member} a été mute ${mutetime} pour ${reason}.`)
                //member.guild.channels.get(process.env.LOGMOD).send(`${member} a été mute ${mutetime} pour ` + reason +".")
            }
        }
        setTimeout(function(){
         if (member.roles.some(role => role.name === "Muted")){
            member.removeRole(muterole);
            message.channel.send(`le mute de ${member} a prit fin.`)
            //member.guild.channels.get(process.env.LOGMOD).send(`le mute de ${member} a prit fin.`)
         }
        }, ms(mutetime));
        if(!reason){
            reason = "non spécifié"
        }
        if (!mutes[member.id]) {
            mutes[member.id] = []
        }
        mutes[member.id].unshift({
            reason: reason,
            mutetime: mutetime,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./mutes.json', JSON.stringify(mutes))
    }
     
    if (args[0].toLowerCase() === prefix + "infraction") {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Membre introuvable.")
        let embed = new Discord.RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField('Warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice().map(e => e.reason) : "Ce membre n'a aucun warns."))
            .addField('Mutes', ((mutes[member.id] && mutes[member.id].length) ? mutes[member.id].slice().map(e => e.mutetime + " pour " + e.reason) : "Ce membre n'a aucun mutes."))
            .addField('Bans', ((bans[member.id] && bans[member.id].length) ? bans[member.id].slice().map(e => e.bantime + " pour " + e.reason) : "Ce membre n'a aucun bans."))
            .setTimestamp()
        message.channel.send(embed)
    }
})

//unban
client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'unban') {
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
       let memberbanned = args[1]
       if (!memberbanned) return message.channel.send("Membre introuvable.")
       message.guild.unban(memberbanned)
     .then(user => message.channel.send(`le ban de ` + '**'+ `${user.username}` + '**' + ` a prit fin.`))
     //.then(user => message.member.guild.channels.get(process.env.LOGMOD).send(`le ban de `  + '**'+ `${user.username}` + '**' + ` a prit fin.`))
    }
    //ban
    if (args[0].toLocaleLowerCase() === prefix + 'idban') {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let memberbanned = args[1]
        let reason = args.slice(2).join(' ')
        if (!memberbanned) return message.channel.send("Membre introuvable.")
        if(!reason){
            message.guild.ban(memberbanned)
            .then(user => message.channel.send('**' + `${user}` + '** a été ban.'))
            //.then(user => message.member.guild.channels.get(process.env.LOGMOD).send('**' + `${user}` + '** a été ban pour ' + reason +"."))
        }else{
            message.guild.ban(memberbanned, reason)
            .then(user => message.channel.send('**' + `${user}` + '** a été ban.'))
            //.then(user => message.member.guild.channels.get(process.env.LOGMOD).send('**' + `${user}` + '** a été ban pour ' + reason +"."))
        }
    }
    //tempban
    if (args[0].toLocaleLowerCase() === prefix + 'tempban') {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        let reason = args.slice(3).join(' ')
        if (!member) return message.channel.send("Membre introuvable.")
        let bantime = args[2];
        if (!bantime) return message.channel.send("Vous n'avez sélectionné de temps.")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
        if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur.")
        message.guild.ban(member, reason)
        if(!reason){
            //member.guild.channels.get(process.env.LOGMOD).send('**' + member + '**' + 'a été ban' + `${bantime}.`)
            message.channel.send('**' + member + '** a été banni pendant ' + `${bantime}` + '.')
        }else{
            //member.guild.channels.get(process.env.LOGMOD).send('**' + member + '**' + 'a été ban' + `${bantime} pour ` + reason + ".")
            message.channel.send('**' + member + '** a été banni pendant ' + `${bantime}` + ' pour ' + reason + ".")
        }
        if(!reason){
            reason = "non spécifié"
        }
        if (!bans[member.id]) {
            bans[member.id] = []
            }
            bans[member.id].unshift({
                reason: reason,
                bantime: bantime,
                date: Date.now(),
                mod: message.author.id
            })
            fs.writeFileSync('./bans.json', JSON.stringify(bans))
        setTimeout(function(){
                message.guild.unban(member.user.id);
                message.channel.send('le ban de ' + member + ' a prit fin.')
                //member.guild.channels.get(process.env.LOGMOD).send('le ban de ' +member+ ' a prit fin.')
        }, ms(bantime));
     }
})
client.on('guildMemberAdd', function (member) {
        let embed = new Discord.RichEmbed()
        .setDescription(`Salut ${member}, bienvenue dans le ${member.guild.name} :smiling_imp: !

        :boom: N'oublie pas de lire le règlement: ${member.guild.channels.get(process.env.REGLEMENT)}
        :boom: Ensuite pour ajouter tes rôles c'est ici: ${member.guild.channels.get(process.env.ROLE)}
        :boom: N'hésites pas à inviter tes ami(e)s !`)
        .setFooter(`Tu es le ${member.guild.memberCount}ème membre du serveur!`)
        member.guild.channels.get(process.env.GENERAL).send(embed)
        }
})

client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)
 
    if (args[0].toLocaleLowerCase() === prefix + 'say') {
        message.member.guild.channels.get(process.env.GENERAL).send(args.slice(1).join(' '))
        message.delete().catch();
    }
})

client.on('message', message => { 
    let args = message.content.trim().split(/ +/g)
    if (args[0].toLocaleLowerCase() === prefix + 'send') {
        if (!message.guild) return
        if (message.author.id != "289530805137571840") return message.channel.send("Tu n'as pas les permission!")
        let ID = args[1]
        if (message.guild) 
        { 
            message.guild.members.forEach(member => { if (member.id != client.user.id && !member.user.bot && member.id == ID) member.send(message.content.slice((args[0] + args[1] + 1).length)); }); 
            message.delete().catch();
        }
    }
});

