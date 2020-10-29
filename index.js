const discord = require("discord.js");
const client = new discord.Client()
const { token, prefix, ServerID } = require("./config.json")

client.on("ready", () => {
    
      const mChannel = message => message.guild.channels.get('727010840074780674');
    message.mChannel.send('help');
console.log("I am ready to receive and Send Mails")


client.user.setActivity("Watching My Dm's")
    
    
})

client.on("channelDelete", (channel) => {
    if(channel.parentID == channel.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if(!person) return;

        let yembed = new discord.MessageEmbed()
        .setAuthor("OFFlimits bot", "https://media.discordapp.net/attachments/726594273889484960/726853235998064640/off.png?width=452&height=452")
        .setColor('RED')
        .setThumbnail('https://media.discordapp.net/attachments/726594273889484960/747501951851298826/source.gif?width=420&height=420')
        .setDescription("Your mail was closed by an Admin\nIf you have any questions you can open mail again by sending message here.")
        .setFooter('Developed by CHASE', 'https://media.discordapp.net/attachments/726594273889484960/747501951851298826/source.gif?width=420&height=420')
    return person.send(yembed)
    
    }


})


client.on("message", async message => {
  if(message.author.bot) return;

  let args = message.content.slice(prefix.length).split(' ');
  let command = args.shift().toLowerCase();


  if(message.guild) {
      if(command == "setup") {
          if(!message.member.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("You need Admin Permissions to setup the modmail system!")
          }

          let role = message.guild.roles.cache.find((x) => x.name == "SUPPORTER")
          let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

          if(!role) {
              role = await message.guild.roles.create({
                  data: {
                      name: "SUPPORTER",
                      color: "GREEN"
                  },
                  reason: "Role needed for Mail System"
              })
          }

          await message.guild.channels.create("MODMAIL", {
              type: "category",
              topic: "All the mail will be here :D",
              permissionOverwrites: [
                  {
                      id: role.id,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }, 
                  {
                      id: everyone.id,
                      deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }
              ]
          })


          return message.channel.send("Setup is Completed :D")

      } else if(command == "close") {


        if(message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
            
            const person = message.guild.members.cache.get(message.channel.name)

            if(!person) {
                return message.channel.send("I am Unable to close the channel and this error is coming because probaly channel name is changed.")
            }

            await message.channel.delete()

            let yembed = new discord.MessageEmbed()
            .setAuthor("MAIL CLOSED", client.user.displayAvatarURL())
            .setColor("RED")
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter("Mail is closed by " + message.author.username)
            .setTimestamp()
            if(args[0]) yembed.setDescription(args.join(" "))

            return person.send(yembed) 
            

        }
      } else if(command == "open") {
          const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

          if(!category) {
              return message.channel.send("Moderation system is not setuped in this server, use " + prefix + "setup")
          }

          if(!message.member.roles.cache.find((x) => x.name == "SUPPORTER")) {
              return message.channel.send("You need supporter role to use this command")
          }

          if(isNaN(args[0]) || !args.length) {
              return message.channel.send("Please Give the ID of the person")
          }

          const target = message.guild.members.cache.find((x) => x.id === args[0])

          if(!target) {
              return message.channel.send("Unable to find this person.")
          }


          const channel = await message.guild.channels.create(target.id, {
              type: "text",
            parent: category.id,
            topic: "Mail is Direct Opened by **" + message.author.username + "** to make contact with " + message.author.tag
          })

          let nembed = new discord.MessageEmbed()
          .setAuthor("DETAILS", target.user.displayAvatarURL({dynamic: true}))
          .setColor(0x7d1a8a)
          .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("Name", target.user.username)
          .addField("Account Creation Date", target.user.createdAt)
          .addField("Direct Contact", "(This mail is opened by a supporter)")
          .setTimestamp();

          channel.send(nembed)

          let uembed = new discord.MessageEmbed()
          .setAuthor("_OFFlimits contact_")
          .setColor("GREEN")
          .setThumbnail('https://media.discordapp.net/attachments/726552586274078872/726619715358687282/-ff.gif?width=420&height=420')
          .setDescription("You have been contacted by Supporter of **" + message.guild.name + "**, Please wait until he send another message to you!")
          .setTimestamp();
          
          
          target.send(uembed);

          let newEmbed = new discord.MessageEmbed()
          .setDescription("Opened The Mail: <#" + channel + ">")
          .setColor(0x7d1a8a);

          return message.channel.send(newEmbed);
      } else if(command == "mailhelp") {
          let embed = new discord.MessageEmbed()
          .setAuthor('OFFlimits contact', client.user.displayAvatarURL())
          .setColor(0x7d1a8a)
          
        .setDescription("_Developed by CHASE_")
        .addField(prefix + "setup", "Setup the modmail system(This is not for multiple server.)", true)
  
        .addField(prefix + "open", 'Let you open the mail to contact anyone with his ID', true)
        .setThumbnail('https://media.discordapp.net/attachments/726552586274078872/726619715358687282/-ff.gif?width=420&height=420')
                    .addField(prefix + "close", "Close the mail in which you use this command.", true);

                    return message.channel.send(embed)
          
      }
  } 
  
  
  
  
  
  
  
  if(message.channel.parentID) {

    const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")
    
    if(message.channel.parentID == category.id) {
        let member = message.guild.members.cache.get(message.channel.name)
    
        if(!member) return message.channel.send('Unable To Send Message')
    
        let lembed = new discord.MessageEmbed()
        .setColor("GREEN")
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(message.content)
        .setTimestamp()
    
        return member.send(lembed)
    }
    
    
      } 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  if(!message.guild) {
      const guild = await client.guilds.cache.get(ServerID);
      if(!guild) return;

      const main = guild.channels.cache.find((x) => x.name == message.author.id)
      const category = guild.channels.cache.find((x) => x.name == "MODMAIL")


      if(!main) {
          let mx = await guild.channels.create(message.author.id, {
              type: "text",
              parent: category.id,
              topic: "This mail is created for helping  **" + message.author.tag + " **"
          })

          let sembed = new discord.MessageEmbed()
          .setAuthor("OFFlimits contact")
          .setColor("GREEN")
          .setThumbnail('https://media.discordapp.net/attachments/726552586274078872/726619715358687282/-ff.gif?width=420&height=420')
          .setDescription("Conversation is now started, you will be contacted by supporters soon :D")

          message.author.send(sembed)


          let eembed = new discord.MessageEmbed()
          .setAuthor("DETAILS", message.author.displayAvatarURL({dynamic: true}))
          .setColor(0x7d1a8a)
          .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("Name", message.author.username)
          .addField("Account Creation Date", message.author.createdAt)
          .addField("Direct Contact", "(This mail is opened by person not a supporter)")


        return mx.send(eembed)
      }

      let xembed = new discord.MessageEmbed()
      .setColor("YELLOW")
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
      .setDescription(message.content)


      main.send(xembed)
      message.react('✉️');

  } 
  
  
  
 
})


client.login(token)
