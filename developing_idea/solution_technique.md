barre de progression

const [progress, setProgress] = useState(0);
useEffect(() => {
    // animation progressive
    const timeout = setTimeout(() => {
      setProgress(value);
    }, 100);

    return () => clearTimeout(timeout);
  }, [value]);

<div class="flex justify-between mb-1">
  <span class="text-sm font-medium text-body">Flowbite</span>
  <span class="text-sm font-medium text-body">{progress}%</span>
</div>
<div className="w-full bg-neutral-quaternary rounded-full h-2 overflow-hidden">
  <div
    className="bg-brand h-2 rounded-full transition-all duration-700 ease-out"
    style={{width:`${progress}%`}} 
    />
</div>

pour la data il faut tout remplir si pas de data chercher sinon remplir par average median ou most taken value

pour les plain text il faut que je soit en capacite d identifier des mots clee et si un de ces mots cles sont bons alors je le met a 1 donc il y aura probablements plus de 1000 parametres
automatiser les scores subjectifs  avec des data objective prendre des discours des personnes et faire ne sorte d en extraire les mots importante faire un algorithme ia pour ca avec des scores voir la frequences des publications avec un tresholds de l entreprise pour voir si elle est discrete voir des algos pour voir a  quel point les personnes actionnaire sont des personnes connues ou des personnes de confiance pour pvoir si l actionnariat est de confiance