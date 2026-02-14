## Recorder view
We show a 4 track recorder
1. Section: Audio Input.
   1. Input (x2)
      1. Mic Line In
      2. Trim [optinoal] (boost, MIC needs a lot of amplification. Line (drum machines) need less amplification) 
      3. Line volume
      4. Track Selector
2. Section: Recording and playback
   1. Power Indicator
   2. Time Counter
   3. Casette Deck
   4. Buttons
      1. Record
      2. Play
      3. Rewind
      4. Forward
      5. Stop
      6. Pause
3. Section: Output
   1. Track Volume (x4)
      1. Volume
      2. Panning
      3. Output Level lights

## Reusable Compontents
1. Volume Slider
2. Volume / Paning Knob
3. Press Button
4. Track Selector slider 

## Datamodel
- tape (song)
  - title
  - timestamp <int?>
  - tracks: <list> 
    - panning (-1, 1) <float>
    - volume (0, 1) <float>
- 
- recording active track <1-4, safe> <int>
- master volume 0-1 <float>
- state (STOP, RECORD) <enum>

Grappig zijn als je zelf moet doorspoelen naar nummers. maar misschien handiger dat je dit (ietswat automatiseert)

Je kunt ze dus ook "remixen" waar mensen over elkaar heen recorden...