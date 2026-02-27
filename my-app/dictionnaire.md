#### map function
new_array=tab.map(element,index,table)=>({

    element+=1;
})


#### jsx_affichage_tableau 

tab=[1,2,3,4,5]
<div>
{tab}
</div>
affiche 1 2 3 4 5

#### useState
useState_how_to_write_it
element =useState<Type_of_element>(value_of_element)

#### props
props possible que l on peut passer en react

type childprops = {
    name strings;
    age number;
}
fuction afficher_age_nom({name,age} : childprops){
    <div>
        {name}-{age}
    </div>
}




#### Record<K,V>
Record<k,v> est un type typescript cela signifie
{
    [key : string]:string
}


#### forEach
const tab = [1, 2, 3];

tab.forEach((elemnt)=>{
    console.log(n);
});



#### reduce

array.reduce((acc,element)=>{
    return acc;
})
reduce transforme :
{
    id:123,label:chance
}
en 
{
    123:chance
}



#### useMemo
useMemo

variable= useMemo<returnType>(()=>{
    return complex_calculation
},[dependencies]);


#### props2

cela permet de sassurer de la validite des variables cela disparait dans le javascript mais permet lorsque l on enregsitre le fichier de verfifier la coherence
type AgentGameProps = {
  tone: ThreadTone;
  animate: boolean;
  content: AgentGameContent;
};

function AgentGame({ tone, animate, content }: AgentGameProps) 

equivalent en javascript

function AgentGame({ tone, animate, content }) {}

#### every 
verifie que chaque element respecte la condition si un seul ou plus ne la respecte pas alors return false
boolean return
table.every((element,index,array)=>{
    return condition;
});

#### function_without_parm_props
function function_name({onclick}:{onlcick : () => void }){};
()=>void : ne prend aucun parametre et ne retourne rien
#### function_with_param_props

function function_name({onSelect}:{onSelect : (id:string)=>void}){};


#### find 
retourne un element
table.find(argument => condition)
example : table.find(n => n > 25); retun le premier element qui est superieur a 25 dans le table
#### sort
#### spread_operator
[...list,new_element] permet de rajouter un element a la fin d un tableau
#### variable qui contient une fonction

var = (param_a:string,param_b:string,param_c: ()=>void)=>{function_var}
donc on peut appeler var()
#### operand !==

strictement different meme valeur ET meme type

#### filter

table.filter((element,index,table)=>{
    condition
});

example
table = [1,2,3,4,5]
table.filter((element)=>{
    return element>2;
}) 
retourne [3,4,5]
#### include
permet de regarder si une variable se trouve ou non dans un tableau
table.include(argumenet) retourne true ou false


#### new_element

const a = b ? thing : thing
window.settimeout


 const selectedPrimaryLabels = primaryCriteria.length
    ? primaryCriteria
        .map((criterionId) => optionLabelById[criterionId] ?? criterionId)
        .join(", ")
    : "-";

isSelected ? 

className={cn(
"cta-soft shadow-none hover:shadow-none",
analysisStep === 0 && "pointer-events-none opacity-50"
)}


les children comment ca marche 
export default function PageShell({
  children,
  tone = DEFAULT_TONE,
  density = 26,
  align = "center",
  className,
}: PageShellProps) {
  return (
    <section
      className={cn(
        relative min-h-screen w-full px-4 sm:px-6 lg:px-10,
        className
      )}
    >
      <div className="absolute inset-0 sand-backdrop" >
      <div className="absolute inset-0 sand-haze opacity-70" >
      <AnimatedThreads
        tone={tone}
        density={density}
        speed={0.45}
        className="opacity-30"
      />
      <div
        className={cn(
          relative z-10 mx-auto flex min-h-screen max-w-[1100px] pb-16 pt-28,
          alig = start ? items-start : items-center
          
      >
        {children}
      </div>
    </section>
  

  
