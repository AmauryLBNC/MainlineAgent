
# React Basics
## hook

qu est ce qu un hook :  c est une fonction speciale qui permetn a un ocmposant d utiliser des mecanismes react comme :<br>
    - state <br>
    - effets <br>
    - contexte <br>
    - logique reutilisable<br>
---
example simple <br>
 const [count,setCount]=useState(0);<br>
ce hook permet a ton composant de stocker une valeur count qui peut changer dans le temps <br>
le hook return un objet complexe et son nom doit commencer par use<br>


## basic hooks

### useState 
const [count, setCount] = useState(0);<br>

- count valeur actuelle<br>
- setCount la fonction pour modifier la valeur<br>
- 0 la valeur de depart<br>

### useEffect

useEffect(() => {
  console.log("count a changé :", count);
}, [count]);

ce hook permet d executer la fonction des que la variables dans les crochet change de valeur

### useRef

const inputRef = useRef<HTMLInputElement | null>(null);
<input ref={inputRef} />

ce hook permet de garder une reference elle permet de garder une variable en memoire malgre les rerender
on utilise une variable useRef car le risque avec une variable simple est que la valeur soit perdue a chaque rerender

## useCallback

const handleClick = useCallback(() => {
  console.log("clic");
}, []);
permet de memoriser une fonction pour eviter qu elle se recree a chaque rerender

## useMemo 

const total = useMemo(() => {
  return prix * quantite;
}, [prix, quantite]);
cela permet de stocker le resultat d un calcul tant que les inputs du calcul ne change pas on fait cela quand les calculs sont lourds

map
## listener