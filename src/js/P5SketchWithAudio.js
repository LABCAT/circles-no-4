import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import DrumHit from './classes/DrumHit.js';
import Rings from './classes/Rings.js';
import Bubble from './classes/Bubble.js';

import audio from "../audio/circles-no-4.ogg";
import midi from "../audio/circles-no-4.mid";

const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.song = null;

        p.tempo = 108;

        p.barAsSeconds = Math.floor(((60 / p.tempo) * 4) * 100000) / 100000;

        p.PPQ = 3840 * 4;

        p.drumHits = [];
        
        p.metalRings = [];

        p.bubbles = [];

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[5].notes; // Redrum 1
                    const noteSet2 = result.tracks[1].notes; // Maelstrom 1 - Ballstabbin
                    const noteSet3 = result.tracks[4].notes; // Maelstrom 3 - Hot And Spicy
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.scheduleCueSet(noteSet3, 'executeCueSet3');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.backgroundColour = 0;

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.background(p.backgroundColour);
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
                for (var i = 0; i < p.drumHits.length; i++) {
                    p.drumHits[i].update();
                    p.drumHits[i].draw();
                }

                for (var i = 0; i < p.metalRings.length; i++) {
                    p.metalRings[i].update();
                    p.metalRings[i].draw();

                    if (p.metalRings[i].y > p.height) {
                        p.metalRings.splice(i, 1);
                    }
                }

                for (var i = 0; i < p.bubbles.length; i++) {
                    p.bubbles[i].update();
                    p.bubbles[i].draw();
                    if (p.bubbles[i].ballisFinished()) {
                        p.bubbles.splice(i, 1);
                    }
                }
            }
        }

        p.executeCueSet1 = (note) => {
            let xPos = Math.floor(note.time * 100000) / 100000;
            if(parseFloat(xPos) >= parseFloat(p.barAsSeconds)){
                while(xPos >= p.barAsSeconds){
                    xPos = xPos - p.barAsSeconds;
                }

                xPos = xPos > 0 ? xPos : 0;
            }

            let x = (p.width/32) + (p.width / p.barAsSeconds * xPos);
            let y = 0;
            let fill = 255;

            switch(note.midi) {
                case 44:
                    y = (p.height / 6) * 1;
                    fill = 255;
                    break;
                case 37:
                    y = (p.height / 6) * 3;
                    fill = 191;
                    break;
                case 36:
                    y = (p.height / 6) * 5;
                    fill = 127;
                    break;
            } 

            p.drumHits.push(new DrumHit(p, x, y, p.width / 16, fill));    
        }

        p.colourPallete = [
            "#F94144", "#F65A38", "#F3722C",
            "#F68425", "#F8961E", "#F9AF37",
            "#F9C74F", "#C5C35E", "#90BE6D",
            "#6AB47C", "#43AA8B", "#4D908E",
        ];

        p.executeCueSet2 = (note) => { 
            if(note.currentCue % 11 == 1 && note.currentCue > 1){
                p.backgroundColour--;
                p.background(p.backgroundColour);
                p.bubbles = [];
                const randomColor = require('randomcolor');
                p.colourPallete = randomColor({
                    count: 12,
                    luminosity: 'dark'
                });;
            }
            let xPos = Math.floor(note.time * 100000) / 100000;
            const twoBars = p.barAsSeconds * 2;
            if(parseFloat(xPos) >= parseFloat(twoBars)){
                while(xPos >= twoBars){
                    xPos = xPos - twoBars;
                }

                xPos = xPos > 0 ? xPos : 0;
            }
            const x = (p.width/32) * 3 + (p.width / twoBars * xPos);
            p.metalRings.push(new Rings(p, x, p.colourPallete));
        }

        p.executeCueSet3 = (note) => { 
            if(note.currentCue % 11 == 1 && note.currentCue < 55){
                p.backgroundColour--;
                p.background(p.backgroundColour);
                p.metalRings = [];
            }
            let xPos = Math.floor(note.time * 100000) / 100000;
            const twoBars = p.barAsSeconds * 2;
            if(parseFloat(xPos) >= parseFloat(twoBars)){
                while(xPos >= twoBars){
                    xPos = xPos - twoBars;
                }

                xPos = xPos > 0 ? xPos : 0;
            }
            const x = (p.width/32) * 3 + (p.width / twoBars * xPos),
                y = p.random(0, p.height);
            for (var i = 0; i < 32; i++) {
                p.bubbles.push(
                    new Bubble(
                        p, 
                        p.map(x, 0, p.width, p.width, 0), 
                        y, 
                        p.colourPallete
                    )
                );
            }
        }

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
