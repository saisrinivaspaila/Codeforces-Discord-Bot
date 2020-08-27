const Discord = require(`discord.js`);
const https = require(`https`);
const { prefix, token } = require(`./config.json`);
const client = new Discord.Client();
const upComingEmbed = new Discord.MessageEmbed();
const helpEmbed = new Discord.MessageEmbed();
const onGoingEmbed = new Discord.MessageEmbed();
const onGoingMessageEmbed = new Discord.MessageEmbed();
OnGoingContestMessages = {};
color = "#3677F0";
scheduleExecution = (futureDate, callback) => {
    var maxInterval = 60 * 60 * 1000;
    var now = new Date();
    if (futureDate - now > maxInterval) {
        setTimeout(function () {
            scheduleExecution(futureDate);
        }, Math.min(futureDate - now, maxInterval));
    } else {
        setTimeout(callback, futureDate - now);
    }
};
onGoing = [];
upComing = [];
updateOnGoing = (ContestName, id, seconds, start, end) => {
    let val = {
        name: ContestName,
        value: `Contest Id: ${id}\nContest Start Time: ${start}\nContest Duration (in hrs): ${end}`,
    };
    ind = upComing.indexOf(val);
    upComing.splice(ind, 1);
    onGoing.push(val);
    scheduleExecution(new Date(seconds * 1000), () => {
        ind = onGoing.indexOf({
            name: ContestName,
            value: `Contest Id: ${id}\nContest Start Time: ${start}\nContest Duration (in hrs): ${end}`,
        });
        if (ind > -1) {
            onGoing.splice(ind, 1);
        }
    });
};
months = {
    0: `Jan`,
    1: `Feb`,
    2: `March`,
    3: `April`,
    4: `May`,
    5: `June`,
    6: `July`,
    7: `Aug`,
    8: `Sept`,
    9: `Oct`,
    10: `Nov`,
    10: `Dec`,
};
client.once(`ready`, () => {
    https
        .get(`https://codeforces.com/api/contest.list?gym=false`, (resp) => {
            var upComingContestFields = [];
            var data = ``;
            resp.on(`data`, (chunk) => {
                data += chunk;
            });
            resp.on(`end`, () => {
                data = JSON.parse(data).result;
                for (var i in data) {
                    if (data[i].phase != `BEFORE`) {
                        break;
                    }
                    dateObj1 = new Date(data[i].startTimeSeconds * 1000);
                    month = months[dateObj1.getMonth()];
                    date = dateObj1.getUTCDate().toString().padStart(2, `0`);
                    hours = dateObj1.getUTCHours().toString().padStart(2, `0`);
                    minutes = dateObj1
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, `0`);
                    timeString1 = `${month} ${date} ${hours}:${minutes}`;
                    dateObj2 = new Date(data[i].durationSeconds * 1000);
                    hours = dateObj2.getUTCHours().toString().padStart(2, `0`);
                    minutes = dateObj2
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, `0`);
                    seconds = dateObj2.getSeconds().toString().padStart(2, `0`);
                    timeString2 = `${hours}:${minutes}`;
                    if (OnGoingContestMessages[data[i].name] == undefined) {
                        OnGoingContestMessages[data[i].name] = 1;
                        scheduleExecution(
                            new Date(
                                data[i].startTimeSeconds * 1000 - 5 * 60 * 1000
                            ),
                            () => {
                                onGoingMessageEmbed.fields = [
                                    {
                                        name: data[i].name,
                                        value: `Contest Id: ${data[i].id}\nContest Start Time: ${timeString1}\nContest Duration (in hrs): ${timeString2}\nDo participate\nHappy Coding`,
                                    },
                                ];
                                updateOnGoing(
                                    data[i].name,
                                    data[i].id,
                                    data[i].startTimeSeconds +
                                        data[i].durationSeconds,
                                    timeString1,
                                    timeString2
                                );
                                // message.channel.send(onGoingMessageEmbed);
                            }
                        );
                    }
                    upComingContestFields.push({
                        name: `${data[i].name}`,
                        value: `Contest Id: ${data[i].id}\nContest Start Time: ${timeString1}\nContest Duration (in hrs): ${timeString2}`,
                    });
                }
                upComing = upComingContestFields;
            });
            console.log("Ready");
        })
        .on(`error`, (err) => {
            console.log(`Error: ` + err.message);
        });

    upComingEmbed.setTitle(`Up coming contests in Codeforces`);
    upComingEmbed.setColor(color);
    helpEmbed.setTitle(`I can let you know about the Codeforces contests.`);
    helpEmbed.setColor(color);
    helpEmbed.fields = [
        {
            name: `Here are the list of commands`,
            value: `<> upcomming - gives you the list of ongoing contests.\n<> ongoing - gives you the list of ongoing contests.\n<> help - help`,
        },
    ];
    onGoingMessageEmbed.setTitle(
        "There is an ongoing contest in Codeforces in few minutes"
    );
    onGoingMessageEmbed.setColor(color);
    onGoingEmbed.setTitle(`On Going Contests in Codeforces (in few minutes)`);
    onGoingEmbed.setColor(color);
});
setInterval(() => {
    https
        .get(`https://codeforces.com/api/contest.list?gym=false`, (resp) => {
            var upComingContestFields = [];
            var data = ``;
            resp.on(`data`, (chunk) => {
                data += chunk;
            });
            resp.on(`end`, () => {
                data = JSON.parse(data).result;
                for (var i in data) {
                    if (data[i].phase != `BEFORE`) {
                        break;
                    }
                    dateObj1 = new Date(data[i].startTimeSeconds * 1000);

                    month = months[dateObj1.getMonth()];
                    date = dateObj1.getUTCDate().toString().padStart(2, `0`);
                    hours = dateObj1.getUTCHours().toString().padStart(2, `0`);
                    minutes = dateObj1
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, `0`);
                    timeString1 = `${month} ${date} ${hours}:${minutes}`;
                    dateObj2 = new Date(data[i].durationSeconds * 1000);
                    hours = dateObj2.getUTCHours().toString().padStart(2, `0`);
                    minutes = dateObj2
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, `0`);
                    seconds = dateObj2.getSeconds().toString().padStart(2, `0`);
                    timeString2 = `${hours}:${minutes}`;
                    if (OnGoingContestMessages[data[i].name] == undefined) {
                        OnGoingContestMessages[data[i].name] = 1;
                        scheduleExecution(
                            new Date(
                                data[i].startTimeSeconds * 1000 - 5 * 60 * 1000
                            ),
                            () => {
                                onGoingMessageEmbed.fields = [
                                    {
                                        name: data[i].name,
                                        value: `Contest Id: ${data[i].id}\nContest Start Time: ${timeString1}\nContest Duration (in hrs): ${timeString2}\nDo participate\nHappy Coding`,
                                    },
                                ];
                                updateOnGoing(
                                    data[i].name,
                                    data[i].id,
                                    data[i].startTimeSeconds +
                                        data[i].durationSeconds,
                                    timeString1,
                                    timeString2
                                );

                                // message.channel.send(onGoingMessageEmbed);
                            }
                        );
                    }
                    upComingContestFields.push({
                        name: `${data[i].name}`,
                        value: `Contest Id: ${data[i].id}\n Contest Start Time: ${timeString1}\n Contest Duration (in hrs): ${timeString2}`,
                    });
                }
                upComing = upComingContestFields;
            });
        })
        .on(`error`, (err) => {
            console.log(`Error: ` + err.message);
        });
}, 60 * 60 * 1000);

client.on(`message`, (message) => {
    messageSent = message.content;
    if (messageSent.startsWith(`${prefix}`)) {
        if (messageSent == `${prefix} upcoming`) {
            upComingEmbed.fields = upComing;
            message.channel.send(upComingEmbed);
        } else if (messageSent == `${prefix} ongoing`) {
            if (onGoing.length == 0) {
                onGoingEmbed.fields = [
                    {
                        name: `There are no on Going contests at present, please checkout later.`,
                        value: `Happy Coding`,
                    },
                ];
            } else {
                onGoingEmbed.fields = onGoing;
            }
            message.channel.send(onGoingEmbed);
        } else {
            message.channel.send(helpEmbed);
        }
    }
});
client.login(token);
