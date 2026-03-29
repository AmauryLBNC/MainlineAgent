# USE SECTION SCROLL

### 1
Pourquoi c est un hook ?<br>
- Par ce que son nom commence par use<br>
- Difference avec une fonction classique ici le return est un objet<br>
- Le hook ne dessine rien a l ecran il prepare juste le comportement <br>
<br>

### 2
```ts
"use client";
```
le code est charge cote client
<br>


### 3
```ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
```
on utilise les hooks basics de react
<br>

### 4
```ts
import { SECTION_EVENT, type SectionId } from "@/lib/section-navigation";
```
on import sectionId comme un type 
<br>

### 5
```ts
export const SECTION_EVENT = "mainagent:section";
```
permet de stocker l evenement qui va permettre d appeler directement une fonction precise
<br>


### 6
```ts
export type SectionScrollDirection = "down" | "up";
```
pour savoir le sens du scoll
<br>

### 7
```ts
export type SectionAnimationStage = "idle" | "pre" | "run";
```
idle : repos , pre : preparation , run : animation en cours
<br>

### 8
```ts
export type UseSectionScrollOptions = {
  sectionIds: readonly SectionId[];
  quizIndex: number;
  rotateIntervalMs?: number;
  transitionDurationMs?: number;
  wheelThreshold?: number;
  touchThreshold?: number;
};
```
sectionIds : savoir a quelle section nous sommes momo|buffet...<br>
quizIndex : connaitre l index du quizz<br>
rotateIntervalMs : Le delai de rotation automatique<br>
transitionDuration : la duree de la rotation entre deux sections<br>
whellThreshold : le seuil d accumulation de molette pour declencher un changement de section<br>
touchThreshold meme chose pour su swipe tactile<br>
<br>





### 9
```ts
export type UseSectionScrollResult = {
  active: number;
  incoming: number | null;
  direction: SectionScrollDirection;
  animStage: SectionAnimationStage;
  locked: boolean;
  rotationPaused: boolean;
  transition: string;
  getTransform: (index: number) => string;
  startTransition: (
    direction: SectionScrollDirection,
    targetIndex: number
  ) => void;
  handleQuizInteract: () => void;
  handleQuizExit: () => void;
  handleQuizComplete: () => void;
};
```

ceci est le retour du hook <br>

active : index de la section actuellemnt affiche<br>
incoming : index de la section qui est en train d entrer pendant une transition<br>
direction : sens de la transition up down<br>
animStage : phase actuelle de l animation  repos, preparation, animation en cours<br>
locked true or false savoir si la page est locked pour le quizz<br>
rotation paused : savoir si l auto rotation est en pause<br>
transition string chaine css pour la propriete de la transition<br>
getTransform fonctionqui dit quelle transformation css appliquer a une section selon l index<br>
starttransition : fonction qui lance un changement de fonction<br>
handlequizzinteract fonction a appeler quand l utilisateur interagit avec le quiz<br>
handlequizexit : fonction quand on quitte le quizz<br>
handlequizcomplete : fonction a appeler quand l utilisateur quitte le quizz<br>
<br>

### 10
```ts
const DEFAULT_ROTATE_INTERVAL_MS = 10000;
```
on met l intervale de rotation a 10 secondes
<br>

### 11
```ts
const DEFAULT_TRANSITION_DURATION_MS = 950;
```
on met le temps de transition d animation a 0.95 secondes
<br>

### 12
```ts
const DEFAULT_WHEEL_THRESHOLD = 120;
```
on met le treshold de scroll a 120
<br>

### 13
```ts
const DEFAULT_TOUCH_THRESHOLD = 90;
```
on met le treshold de swipe tactile a 90<br>




### 14
```ts
export function useSectionScroll({
  sectionIds,
  quizIndex,
  rotateIntervalMs = DEFAULT_ROTATE_INTERVAL_MS,
  transitionDurationMs = DEFAULT_TRANSITION_DURATION_MS,
  wheelThreshold = DEFAULT_WHEEL_THRESHOLD,
  touchThreshold = DEFAULT_TOUCH_THRESHOLD,
}: UseSectionScrollOptions): UseSectionScrollResult {
```
debut du hook<br>
inputs : les input sont des UseSectionScrollOptions decrit plus haut<br>
output :  les outputs sont des UseSectionScrollResult decrit plus haut<br>
<br>


  ### 15
  ```ts
  const [active, setActive] = useState(0);
  ```
  index de la section active on commence a la section 0
  <br>

  ### 16
  ```ts
  const [incoming, setIncoming] = useState<number | null>(null);
  ```
  section a venir non null quand transition en cours
  <br>

  ### 17
  ```ts
  const [direction, setDirection] = useState<SectionScrollDirection>("down");
  ```
  direction du scroll up down valeur initiale down
  <br>

  ### 18  
  ```ts
  const [animStage, setAnimStage] = useState<SectionAnimationStage>("idle");
  ```
  etat de l animation repos,  preparation, animation en cours
  <br>

  ### 19
  ```ts
  const [locked, setLocked] = useState(false);
  ```
  savoir si la les transition sont bloque ou non valeur initiale false
  <br>

  ### 20
  ```ts
  const [rotationPaused, setRotationPaused] = useState(false);
  ```
  savoir si l auto-rotation est en pause valeur initiale false
  <br>

  ### 21
  ```ts
  const pausedByQuizRef = useRef(false);
  ```
  est ce que le quizz stoppe la rotation valeur initiale false
  <br>

  ### 22
  ```ts
  const wheelAccumRef = useRef(0);
  ```
  stocke l accumulation de deltas molette
  <br>

  ### 23
  ```ts
  const touchStartYRef = useRef(0);
  ```
  position Y initiale du doigt lors du debut du swipe
  <br>

  ### 24
  ```ts  
  const touchStartXRef = useRef(0);
  ```
  position X initiale du doigt lors du debut du swiipe
  <br>

  ### 25
  ```ts
  const touchAccumRef = useRef(0);
  ```
  deltas tactile vertical accumule
  <br>

  ### 26
  ```ts
  const lastActivityRef = useRef(0);
  ```
  derniere activite du user pour l auto rotation
  <br>
  
  ### 27
  ```ts
  const idleTimerRef = useRef<number | null>(null);
  ```
  identifiant du timer d inactivite
  <br>
  
  ### 28
  ```ts
  const transitionTimerRef = useRef<number | null>(null);
  ```
  identifiant du timer qui termine la transition apres sa duree
  <br>
  
  ### 29
  ```ts
  const animationFrameRef = useRef<number | null>(null);
  ```
  identifiant du request animationframe
  <br>
  
  ### 30
  ```ts
  const activeRef = useRef(active);
  ```
  version reference de active 
  <br>

  ### 31
  ```ts
  const lockedRef = useRef(locked);
  ```
  version reference de locked 
  <br>

  ### 32
  ```ts
  const rotationPausedRef = useRef(rotationPaused);
  ```
  version reference de rotation paused

  ### 33
  ```ts
  const totalSections = sectionIds.length;
  ```
  on stocke le nombre total de section

  ### 34
  ```ts
  const safeQuizIndex =quizIndex >= 0 && quizIndex < totalSections ? quizIndex : -1;
  ```
  check que quiz inzIndex est superieur a 0 et inferieur a l idex maximum possible
  

  

  ## fonction sectionIndexById

  ### 35
  ```ts
  const sectionIndexById = useMemo(() => {
    on parcours le tableau sectionIds
    return sectionIds.reduce<Record<SectionId, number>>((acc, sectionId, index) => {
      on construit l objet de sortie petit a petit
      acc[sectionId] = index;
      on retourne l objet
      return acc;
    objet initial vide type comme une table sectionId -> number
    }, {} as Record<SectionId, number>);
  cette donction est executer si sectionids change
  }, [sectionIds]);
  ```
  permet de construire un objet de type <br>
  ```ts
  {
    momo : 0
    buffet : 1
    company : 2
    agentgame : 3
  }
  ```
  cela se fait quand sectionId change


  ## fonction clearIdleTimer

  ### 36

  ```ts
  const clearIdleTimer = useCallback()
  ```
  on verifie qu un timer est actif
  ```ts
  if (idleTimerRef.current !== null) {
  ```
  on l annule
  ```ts
  window.clearTimeout(idleTimerRef.current);
  ```
  plus de timer actif
  ```ts
  idleTimerRef.current = null;
  ```
  fonction que l on garde en memoire

  ## fonction clearTransistionTimer

  ### 37
  ```ts
  const clearTransitionTimer = useCallback(()
  if (transitionTimerRef.current !== null) {
  ```
  on verifie que le timer existe
  
  ```ts
  window.clearTimeout(transitionTimerRef.current);
  ```
  on l anule
  
  ```ts
  transitionTimerRef.current = null;
  ```
  plus de timer actif
  
  ```ts
  if (animationFrameRef.current !== null) 
  ```
  annule le requestanimationframe qui devait faire passer de pre a run
  ```ts
  window.cancelAnimationFrame(animationFrameRef.current);
  animationFrameRef.current = null;
  }, []);
  ```
  fonction que l on garde en memoire nettoyer tout ce qui concerne une tranition en attente

  ## fonction getWrappedIndex

  ### 38
  ```ts
  const getWrappedIndex = useCallback(
    (index: number) => {
      if (totalSections === 0) {
        return 0;
      }

      return (index + totalSections) % totalSections;
    },
    [totalSections]
  );
  ```
  rapporte nimporte quelle index dans une plage valide on fait un modulo pour etre sure que cest dans une plage valide

  ## fonction start transition

   
   ```ts
  const startTransition = useCallback(
  (nextDirection: SectionScrollDirection, targetIndex: number)
  ```
  cette fonction gere les verification le verouillage la preparation, le lancement de l animation , la finalisation


  ```ts
  if (totalSections <= 1) {
    return;
  }
  ```
  si il y a 0 ou 1 section pas de transition

  on force l index a etre dans les limites de tableau
  const normalizedTargetIndex = getWrappedIndex(targetIndex);


  blocage is impossible a cause d une transition dejja en cours
  ```ts
  if (
    lockedRef.current ||
    normalizedTargetIndex === activeRef.current
  ) {
    return;
  }
  ```


  si on est actuellement sur le quiz qu on s apprete a en sortir et que la pause venait du quizz alors on enleve la pause
  ```ts
  if (
    activeRef.current === safeQuizIndex &&
    normalizedTargetIndex !== safeQuizIndex &&
    pausedByQuizRef.current
  ) {
    pausedByQuizRef.current = false;
    rotationPausedRef.current = false;
    setRotationPaused(false);
  }
  ```
  nettoyage des timer de toute transition precedente
  ```ts
  clearTransitionTimer();
  ```
  transition verouiller
  ```ts
  lockedRef.current = true;
  setLocked(true);
  ```

  stocke le sens de la direction
  ```ts
  setDirection(nextDirection);
  ```

  stocke quelle section doit entrer
  ```ts
  setIncoming(normalizedTargetIndex);
  ```

  on met le stage a preparation
  ```ts
  setAnimStage("pre");
  ```
  
  passage au frame suivant
  ```ts
  animationFrameRef.current = window.requestAnimationFrame()
  ```

  on met l animation a run
  ```ts
  setAnimStage("run");
  ```

  on attend la fin de la transition
  ```ts
  transitionTimerRef.current = window.setTimeout() 
  ```
  la section cible devinet la section active
  ```ts
  activeRef.current = normalizedTargetIndex;
  setActive(normalizedTargetIndex);
  ```

  plus de section entrante
  ```ts
  setIncoming(null);
  ```

  on est en state repos pour l animation
  ```ts
  setAnimStage("idle");
  ```

  plus de verouillage pour animation
  ```ts
  lockedRef.current = false;
  setLocked(false);
  ```

  le timer de transition n existe plus
  ```ts
  transitionTimerRef.current = null;
}, transitionDurationMs;
```
```ts
[
  clearTransitionTimer,
  getWrappedIndex,
  safeQuizIndex,
  totalSections,
  transitionDurationMs,
] 
```
callback recree si une de ces valeurs change



  permet de synchronise les refs avec les states quand les states change
  useEffect(() => {
    activeRef.current = active;
    lockedRef.current = locked;
    rotationPausedRef.current = rotationPaused;
  }, [active, locked, rotationPaused]);

  on stocke la derniere activite au debut
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  /**
   * Auto-rotation is always scheduled from the last detected activity so users
   * never lose context because of an old timer that kept running in the background.
   */


  on planifie la prochaine roation automatique
  const scheduleAutoRotate = useCallback(() => {
    on annule l ancien timer
    clearIdleTimer();
    on annule si pas plus de 1 section ou si rotation est en pause
    if (rotationPausedRef.current || totalSections <= 1) {
      return;
    }
    on cree une fonction qui sera appele par le timer
    const tick = () => {
      si la rotation a ete mis en pause entre temps on arrete 
      if (rotationPausedRef.current) {
        idleTimerRef.current = null;
        return;
      }

      on prend l heure actuelle
      const now = Date.now();

      on declenche autotransition si aucune transition n est en cours  et temps ecoule
      if (
        !lockedRef.current &&
        now - lastActivityRef.current >= rotateIntervalMs
      ) {
        met a jour la derniere activite
        lastActivityRef.current = now;
        on fait la transition
        startTransition("down", activeRef.current + 1);
      }
      on reprogramme le prochain controle
      idleTimerRef.current = window.setTimeout(tick, rotateIntervalMs);
    };
    
    const elapsed = Date.now() - lastActivityRef.current;
    const remaining = Math.max(0, rotateIntervalMs - elapsed);
    idleTimerRef.current = window.setTimeout(tick, remaining);
  }, [clearIdleTimer, rotateIntervalMs, startTransition, totalSections]);

  /**
   * Pointer, wheel and touch activity all reset the idle clock so the carousel
   * behaves like a guided narrative, not like a slideshow fighting the user.
   */


  signal activite pour refresh le timer de l auto rotation
  const registerActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    scheduleAutoRotate();
  }, [scheduleAutoRotate]);

  /**
   * Entering the quiz pauses auto-rotation because interaction density is high
   * and moving the page while answering would be disruptive.
   */

  mettre en pause l auto rotation prendant l interaction du quizz
  const handleQuizInteract = useCallback(() => {
    if (rotationPausedRef.current) {
      return;
    }

    rotationPausedRef.current = true;
    pausedByQuizRef.current = true;
    registerActivity();
    setRotationPaused(true);
  }, [registerActivity]);


  gere la sortie du quizz
  const handleQuizExit = useCallback(() => {
    if (safeQuizIndex === -1) {
      return;
    }

    rotationPausedRef.current = false;
    lastActivityRef.current = Date.now();
    pausedByQuizRef.current = false;
    setRotationPaused(false);
    startTransition("down", safeQuizIndex + 1);
    registerActivity();
  }, [registerActivity, safeQuizIndex, startTransition]);


  gere la fin du quizz
  const handleQuizComplete = useCallback(() => {
    if (!rotationPausedRef.current) {
      return;
    }

    rotationPausedRef.current = false;
    lastActivityRef.current = Date.now();
    pausedByQuizRef.current = false;
    setRotationPaused(false);
    registerActivity();
  }, [registerActivity]);
  

  ecouter l evenement de SECTION_EVENT
  useEffect(() => {
    ecouter un evenement externe pour changer de section
    const handleSectionChange = (event: Event) => {

      on considere que l evenement est un custom event dont le detail contient un section id
      const { detail } = event as CustomEvent<SectionId>;

      on prend l index de la section
      const targetIndex = sectionIndexById[detail];
      cas pas d index
      if (targetIndex === undefined) {
        return;
      }
      cas ou transition ou alors section deja active
      if (lockedRef.current || targetIndex === activeRef.current) {
        return;
      }


      on considere cela comme une activite user et on lance la transition dans le bon sens
      registerActivity();
      startTransition(targetIndex > activeRef.current ? "down" : "up", targetIndex);
    };
    on attache un listener
    window.addEventListener(SECTION_EVENT, handleSectionChange as EventListener);

    return () => {
      nettoyage a la destruction
      window.removeEventListener(
        SECTION_EVENT,
        handleSectionChange as EventListener
      );
    };
  }, [registerActivity, sectionIndexById, startTransition]);
  

  effet quand le pointeer bouge pour autorotation
  useEffect(() => {

    on programme la premiere auto rotation
    scheduleAutoRotate();
     
    toute activite de de pointeur repousse auto rotation
    const handlePointerMove = () => {
      registerActivity();
    };
     
    on ecoute les mouvemnts souris pointeur
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      nettoyage listener et timer
      window.removeEventListener("pointermove", handlePointerMove);
      clearIdleTimer();
    };
  }, [clearIdleTimer, registerActivity, scheduleAutoRotate]);


  effet pour la molette
  useEffect(() => {

    /**
     * Trackpads emit many small wheel deltas; waiting for 120 prevents accidental
     * section changes while keeping a deliberate flick responsive.
     */
    chaque scroll molette compte comme activite
    const handleWheel = (event: WheelEvent) => {
      registerActivity();


      si transition en cours le scroll est impossible
      if (lockedRef.current) {
        wheelAccumRef.current = 0;
        event.preventDefault();
        return;
      }
      on ajoute le delta vertical recu
      wheelAccumRef.current += event.deltaY;
      
      si treshold trop petit on annule
      if (Math.abs(wheelAccumRef.current) < wheelThreshold) {
        return;
      }
      on prend la direction
      const nextDirection: SectionScrollDirection =
        wheelAccumRef.current > 0 ? "down" : "up";
      on met a 0 l accumulation
      wheelAccumRef.current = 0;
      on demarre la transition
      startTransition(
        nextDirection,
        nextDirection === "down" ? activeRef.current + 1 : activeRef.current - 1
      );
      on empeche le scroll navigateur normal
      event.preventDefault();
    };
    on arrete d ecouter 
    window.addEventListener("wheel", handleWheel, { passive: false });
     

    on celan tout
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [registerActivity, startTransition, wheelThreshold]);



  effet pour le tactile
  useEffect(() => {
    /**
     * Mobile swipes need a lower threshold than wheel input because the gesture
     * is shorter, but still high enough to ignore diagonal scrolling noise.
     */

     on recupere le premier doigt recupere position et enregistre activite
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      touchStartYRef.current = touch?.clientY ?? 0;
      touchStartXRef.current = touch?.clientX ?? 0;
      registerActivity();
    };

    const handleTouchMove = (event: TouchEvent) => {
        si une transition est en cours on annule l accumulation

      if (lockedRef.current) {
        touchAccumRef.current = 0;
        return;
      }
      calcule le deplacement actuel du doigt
      const touch = event.touches[0];
      const currentY = touch?.clientY ?? 0;
      const currentX = touch?.clientX ?? 0;
      const deltaY = touchStartYRef.current - currentY;
      const deltaX = touchStartXRef.current - currentX;

      si mouvement plus horizontal que vertical ignore
      if (Math.abs(deltaY) < Math.abs(deltaX)) {
        return;
      }
      on ajoute le delta y
      touchAccumRef.current = deltaY;

      si inferieur au treshold ignore
      if (Math.abs(touchAccumRef.current) < touchThreshold) {
        return;
      }
      on prend la prochaine direction
      const nextDirection: SectionScrollDirection =
        touchAccumRef.current > 0 ? "down" : "up";
      touchAccumRef.current = 0;
      startTransition(
        nextDirection,
        nextDirection === "down" ? activeRef.current + 1 : activeRef.current - 1
      );
      event.preventDefault();
    };


    on reset acumulation
    const handleTouchEnd = () => {
      touchAccumRef.current = 0;
    };
    on ajoute des listenertouchstart  actif le mouvement est bloquer  et touchend pour netoyer
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);



    on nettoie tout
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [registerActivity, startTransition, touchThreshold]);


  effet de nettoyage globale
  useEffect(() => {
    return () => {
      clearIdleTimer();
      clearTransitionTimer();
    };
  }, [clearIdleTimer, clearTransitionTimer]);

  gestion du css en fonciton de la section choisis
  const getTransform = useCallback(
    (index: number) => {

      quand rien ne bouge la section est a sa place
      if (animStage === "idle") {
        return index === active ? "translateY(0%)" : "translateY(100%)";
      }
      
      quand une animation est en preparation section active est a sa place
      if (animStage === "pre") {
        if (index === active) {
          return "translateY(0%)";
        }
        si incoming on la place en dessous si on descend au dessus si on monte
        if (index === incoming) {
          return direction === "down"
            ? "translateY(100%)"
            : "translateY(-100%)";
        }

        return "translateY(100%)";
      }
      l animation est en cours
      if (index === active) {
        return direction === "down"
          ? "translateY(-100%)"
          : "translateY(100%)";
      }
      
      if (index === incoming) {
        return "translateY(0%)";
      }

      return "translateY(100%)";
    },
    [active, animStage, direction, incoming]
  );
  determine les propriete css a aplliquer
  const transition =
    animStage === "run"
      ? `transform ${transitionDurationMs}ms cubic-bezier(0.22, 0.7, 0.26, 1)`
      : "none";
  on return le tout
  return {
    active,
    incoming,
    direction,
    animStage,
    locked,
    rotationPaused,
    transition,
    getTransform,
    startTransition,
    handleQuizInteract,
    handleQuizExit,
    handleQuizComplete,
  };
}
