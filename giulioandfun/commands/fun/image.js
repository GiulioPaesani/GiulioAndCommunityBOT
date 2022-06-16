const Discord = require("discord.js")
const colors = require("../../config/general/colors.json")
const { createCanvas, loadImage } = require('canvas');
const { getEmoji } = require("../../functions/general/getEmoji");
const CanvasTextWrapper = require('canvas-text-wrapper').CanvasTextWrapper;

module.exports = {
    name: "image",
    description: "Creare un immagine meme con del testo personalizzato",
    permissionLevel: 0,
    requiredLevel: 20,
    cooldown: 20,
    syntax: "/image [type] [texts]",
    category: "fun",
    client: "fun",
    data: {
        options: [
            {
                name: "drake",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "two_buttons",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "distracted_boyfriend",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "running_away_ballon",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "uno_25_cards",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                ]
            },
            {
                name: "left_exit_12",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    },
                ]
            },
            {
                name: "change_my_mind",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "gru_plan",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text4",
                        description: "Testo da inserire nel quattro riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "expading_brain",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text4",
                        description: "Testo da inserire nel quattro riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "woman_yelling_at_cat",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "tuxedo_winnie_the_pooh",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "clown-applying-makeup",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text4",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "teachers_copy",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "math_lady",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "disappointed_guy",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "ryan_beckford",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "two_guys_on_a_bus",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "three_dragons",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "drowning_kid_in_the_pool",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "grant_gustin_over_grave",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "monkey_puppet",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "disaster_girl",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "sad_pablo_escobar",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text2",
                        description: "Testo da inserire nel secondo riquadro",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "text3",
                        description: "Testo da inserire nel terzo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "unsettled_tom",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "roll_safe_think_about_it",
                description: "Crea un immagine meme con il layout selezionato",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "text1",
                        description: "Testo da inserire nel primo riquadro",
                        type: "STRING",
                        required: true
                    }
                ]
            }
        ]
    },
    channelsGranted: [],
    async execute(client, interaction, comando) {
        let memeGenerator = [
            {
                name: "drake",
                image: "https://i.postimg.cc/G2sNrjj9/Drake-Hotline-Bling.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 100,
                        centerPosition: [600, 200],
                        size: [350, 350],
                        rotation: 0,
                        paddingY: 50,
                    },
                    {
                        name: "text2",
                        startSize: 100,
                        centerPosition: [600, 600],
                        size: [350, 350],
                        rotation: 0,
                        paddingY: 50,
                    },
                ]
            },
            {
                name: "two_buttons",
                image: "https://i.postimg.cc/TPkRWvhy/Two-Buttons.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 70,
                        centerPosition: [110, 140],
                        size: [150, 80],
                        rotation: -12,
                        paddingY: 0,
                    },
                    {
                        name: "text2",
                        startSize: 70,
                        centerPosition: [300, 130],
                        size: [140, 80],
                        rotation: -10,
                        paddingY: 0,
                    },
                    {
                        name: "text3",
                        startSize: 80,
                        centerPosition: [260, 700],
                        size: [400, 100],
                        rotation: 0,
                        paddingY: 0,
                    }
                ]
            },
            {
                name: "distracted_boyfriend",
                image: "https://i.postimg.cc/bwP2YD6N/Distracted-Boyfriend.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 70,
                        centerPosition: [700, 600],
                        size: [250, 150],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text2",
                        startSize: 70,
                        centerPosition: [1000, 600],
                        size: [250, 150],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text3",
                        startSize: 80,
                        centerPosition: [350, 700],
                        size: [400, 150],
                        rotation: 0,
                        paddingY: 0,
                    }
                ]
            },
            {
                name: "running_away_ballon",
                image: "https://i.postimg.cc/Zn5yCdm3/Running-Away-Balloon.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [100, 350],
                        size: [180, 80],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [470, 150],
                        size: [250, 80],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text3",
                        startSize: 50,
                        centerPosition: [80, 700],
                        size: [180, 80],
                        rotation: 0,
                        paddingY: 0,
                    }
                ]
            },
            {
                name: "uno_25_cards",
                image: "https://i.postimg.cc/Y93QXvWS/UNO-Draw-25-Cards.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [240, 320],
                        size: [250, 130],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [700, 70],
                        size: [200, 130],
                        rotation: 0,
                        paddingY: 0,
                    }
                ]
            },
            {
                name: "left_exit_12",
                image: "https://i.postimg.cc/VN69k3KN/Left-Exit-12-Off-Ramp.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 40,
                        centerPosition: [260, 200],
                        size: [120, 140],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text2",
                        startSize: 40,
                        centerPosition: [520, 180],
                        size: [200, 150],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text3",
                        startSize: 50,
                        centerPosition: [400, 750],
                        size: [300, 90],
                        rotation: -10,
                        paddingY: 0,
                    }
                ]
            },
            {
                name: "change_my_mind",
                image: "https://i.postimg.cc/4xV2c8hG/Change-My-Mind.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [610, 670],
                        size: [440, 200],
                        rotation: -8,
                        paddingY: 0,
                    }
                ]
            },
            {
                name: "gru_plan",
                image: "https://i.postimg.cc/qMdWMP50/Grus-Plan.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [265, 130],
                        size: [130, 160],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [615, 130],
                        size: [130, 160],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text3",
                        startSize: 50,
                        centerPosition: [265, 355],
                        size: [130, 160],
                        rotation: 0,
                        paddingY: 0,
                    },
                    {
                        name: "text4",
                        startSize: 50,
                        centerPosition: [615, 355],
                        size: [130, 160],
                        rotation: 0,
                        paddingY: 0,
                    }
                ]
            },
            {
                name: "expading_brain",
                image: "https://i.postimg.cc/1zThsMTq/Expanding-Brain.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [145, 105],
                        size: [270, 180],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [145, 300],
                        size: [270, 180],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text3",
                        startSize: 50,
                        centerPosition: [145, 500],
                        size: [270, 170],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text4",
                        startSize: 50,
                        centerPosition: [145, 700],
                        size: [270, 180],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "woman_yelling_at_cat",
                image: "https://i.postimg.cc/L8t3HsbB/Woman-Yelling-At-Cat.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [305, 95],
                        size: [600, 170],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [930, 95],
                        size: [600, 170],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "tuxedo_winnie_the_pooh",
                image: "https://i.postimg.cc/R0QmQwb6/Senza-titolo-1.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [790, 210],
                        size: [600, 370],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [790, 600],
                        size: [600, 370],
                        rotation: 0,
                        paddingY: 10,
                    },
                ]
            },
            {
                name: "clown-applying-makeup",
                image: "https://i.postimg.cc/JzJN4hG4/Clown-Applying-Makeup.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [215, 105],
                        size: [370, 180],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [215, 300],
                        size: [370, 180],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text3",
                        startSize: 50,
                        centerPosition: [215, 500],
                        size: [370, 170],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text4",
                        startSize: 50,
                        centerPosition: [215, 700],
                        size: [370, 180],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "teachers_copy",
                image: "https://i.postimg.cc/qRCZYsxL/Teacher-s-Copy.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [315, 95],
                        size: [600, 170],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [955, 95],
                        size: [600, 170],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "math_lady",
                image: "https://i.postimg.cc/BnwVZSNt/Math-lady.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [515, 80],
                        size: [920, 140],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "disappointed_guy",
                image: "https://i.postimg.cc/QMWg11ZG/Disappointed-Guy.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 70,
                        centerPosition: [390, 205],
                        size: [650, 370],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 70,
                        centerPosition: [390, 600],
                        size: [650, 370],
                        rotation: 0,
                        paddingY: 10,
                    },
                ]
            },
            {
                name: "ryan_beckford",
                image: "https://i.postimg.cc/9MR8RYRq/Ryan-Beckford.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [400, 80],
                        size: [720, 140],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 60,
                        centerPosition: [400, 700],
                        size: [720, 140],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "two_guys_on_a_bus",
                image: "https://i.postimg.cc/bJFhksDW/Two-guys-on-a-bus.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [200, 340],
                        size: [380, 140],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 60,
                        centerPosition: [660, 295],
                        size: [400, 140],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "three_dragons",
                image: "https://i.postimg.cc/W3RwW6Bv/Three-dragons.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 70,
                        centerPosition: [170, 590],
                        size: [300, 200],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 70,
                        centerPosition: [490, 550],
                        size: [300, 200],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text3",
                        startSize: 70,
                        centerPosition: [840, 590],
                        size: [300, 200],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "drowning_kid_in_the_pool",
                image: "https://i.postimg.cc/0ypmvJKP/Drowning-kid-in-the-pool.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 70,
                        centerPosition: [860, 600],
                        size: [300, 150],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 70,
                        centerPosition: [530, 150],
                        size: [300, 150],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text3",
                        startSize: 70,
                        centerPosition: [200, 400],
                        size: [300, 150],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "grant_gustin_over_grave",
                image: "https://i.postimg.cc/50z5Sjpj/Grant-Gustin-over-grave.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [200, 350],
                        size: [190, 180],
                        rotation: -4,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 70,
                        centerPosition: [530, 650],
                        size: [250, 100],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "monkey_puppet",
                image: "https://i.postimg.cc/rmH3ZfBg/Monkey-Puppet.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [520, 110],
                        size: [920, 170],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "disaster_girl",
                image: "https://i.postimg.cc/ncRz5Hr2/Disaster-Girl.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [520, 90],
                        size: [920, 130],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "sad_pablo_escobar",
                image: "https://i.postimg.cc/rsmmFmwf/Sad-Pablo-Escobar.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 50,
                        centerPosition: [410, 315],
                        size: [520, 100],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text2",
                        startSize: 50,
                        centerPosition: [200, 700],
                        size: [300, 130],
                        rotation: 0,
                        paddingY: 10,
                    },
                    {
                        name: "text3",
                        startSize: 50,
                        centerPosition: [615, 700],
                        size: [300, 130],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "unsettled_tom",
                image: "https://i.postimg.cc/QC2f77gf/Unsettled-Tom.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [500, 90],
                        size: [920, 130],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            },
            {
                name: "roll_safe_think_about_it",
                image: "https://i.postimg.cc/8ktM9MqW/Roll-Safe-Think-About-It.jpg",
                texts: [
                    {
                        name: "text1",
                        startSize: 60,
                        centerPosition: [580, 70],
                        size: [1100, 120],
                        rotation: 0,
                        paddingY: 10,
                    }
                ]
            }
        ]

        let embed = new Discord.MessageEmbed()
            .setTitle(`Creazione immagine...`)
            .setColor(colors.gray)
            .setDescription(`${getEmoji(client, "Loading")} Sto creando la tua immagine`)

        let msg = await interaction.reply({ embeds: [embed], fetchReply: true })

        let meme = memeGenerator.find(x => x.name == interaction.options.getSubcommand())

        let img = await loadImage(meme.image)

        let canvas = await createCanvas(img.width, img.height)
        let ctx = await canvas.getContext('2d')

        ctx.drawImage(img, 0, 0)

        ctx.textBaseline = 'middle';
        for (let text of meme.texts) {
            let testo = interaction.options.getString(text.name) || ""

            let canvasText = await createCanvas(text.size[0], text.size[1])
            let ctxText = await canvas.getContext('2d')

            ctxText.rotate(text.rotation * Math.PI / 180);

            // ctxText.fillStyle = "blue"
            // ctxText.fillRect(text.centerPosition[0] - (text.size[0] / 2), text.centerPosition[1] - (text.size[1] / 2), text.size[0], text.size[1]);

            ctxText.shadowColor = "white";
            ctxText.shadowBlur = 7;

            CanvasTextWrapper(canvasText, testo, {
                textAlign: 'center',
                verticalAlign: 'middle',
                paddingY: text.paddingY,
                sizeToFill: true,
                maxFontSizeToFill: text.startSize,
                lineBreak: "auto",
                allowNewLine: true,
            });

            await ctx.drawImage(canvasText, text.centerPosition[0] - (text.size[0] / 2), text.centerPosition[1] - (text.size[1] / 2), text.size[0], text.size[1])

            ctxText.resetTransform();
        }

        msg.edit({ embeds: [], files: [new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png')] })
    },
};