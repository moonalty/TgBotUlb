const axios = require('axios');
const {parse} = require('node-html-parser')
const { Telegraf } = require('telegraf');
const commands = [
    {
        command: "weather",
        description: "Узнать погоду"
    },
    {
        command: "location",
        description: "Получить мои координаты"
    },
    {
        command: "help",
        description: "Раздел помощи unable"
    },

]

const bot = new Telegraf('1849125913:AAGzHEdlzYsGV_Wjxhmebqdd5FyReeaMuA8');


 bot.telegram.setMyCommands(commands)


bot.start((ctx) => ctx.reply('Welcome'));
bot.launch();
bot.hears('hi', (ctx) => ctx.reply('hehe'));
bot.on ('message', async (ctx) => {
    // bot.command(commands);

    //
    if ((ctx.message.text === 'rolla')){
        console.log('dices rolled')
        ctx.sendDice();
    }
    if(ctx.message.sticker || ctx.message.text === '/weather') {
        try {
            const response = await axios.get('https://mylocation.org');
            const root = parse(response.data);
            const allTags = root.querySelector('#map-0');
                console.log(root.childNodes[0])
            const longitudeAttitude = allTags._attrs.title.split(', ');
            const weatherAPIUrl = `https://api.open-meteo.com/v1/forecast?latitude=${longitudeAttitude[0]}&longitude=${longitudeAttitude[1]}&current=temperature_2m,rain,showers,snowfall,weather_code,wind_speed_10m&hourly=temperature_2m,rain,weather_code,cloud_cover,wind_speed_10m`
            const responseWeather = await axios.get(weatherAPIUrl);
            let weatherCode1 = +responseWeather.data.current.weather_code;
            let weatherCode;
            switch (weatherCode1){
                case 0:
                     weatherCode = 'Чистое небо';
                     break;
                case 1:
                case 2:
                case 3:
                     weatherCode = 'Mainly clear, partly cloudy, and overcast';
                    break
                case 48:
                case 46:
                     weatherCode = 'Fog and depositing rime fog';
                    break
                case 55:
                case 53:
                case 51:
                     weatherCode = 'Drizzle: Light, moderate, and dense intensity';
                    break
                case (56):
                case (57):
                     weatherCode = 'Freezing Drizzle: Light and dense intensity';
                    break
                case 61:
                case 63:
                case 65:
                case 66:
                case 67:
                     weatherCode = 'Rain: Slight, moderate and heavy intensity';
                    break
                case 73:
                case 75:
                     weatherCode = 'Snow Fall';
                    break
                case 95:
                case 96:
                case 99:
                     weatherCode = 'Thunder';
                    break
                default:
                     weatherCode = weatherCode1;
            }

            console.log(` погода - ${weatherCode}, температура: ${responseWeather.data.current.temperature_2m} ${responseWeather.data.current_units.temperature_2m} , скорость ветра: ${responseWeather.data.current.wind_speed_10m} км/ч. ${longitudeAttitude}`);
            ctx.reply(` погода - ${weatherCode}, температура: ${responseWeather.data.current.temperature_2m} ${responseWeather.data.current_units.temperature_2m} , скорость ветра: ${responseWeather.data.current.wind_speed_10m} км/ч`)
        } catch (e){
            console.log(e)
        }

    }

    if (ctx.message.text === '/location'){
        const response = await axios.get('https://mylocation.org');
        const root = parse(response.data);
        const allTags = root.querySelector('#map-0');
        const longitudeAttitude = allTags._attrs.title;
        ctx.reply(`Координаты ${longitudeAttitude}`)
    }
    // await bot.telegram.sendMessage(ctx.chat.id, "Please click on button below.", {
    //     reply_markup: {
    //         inline_keyboard: [
    //             [
    //                 {
    //                     text: "Yes",
    //                     callback_data: "btn_yes"
    //                 },
    //                 {
    //                     text: "No",
    //                     callback_data: "btn_no"
    //                 },
    //
    //             ]
    //         ]
    //     }
    // });

});


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));