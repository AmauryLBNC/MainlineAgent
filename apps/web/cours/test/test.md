# test
 il existe trois types de tests

 - tests unitaire
    - une fonction
    - un composant simple
    - une validation
    - un helper
- test d integration
    - un composant + un formulaire
    - un composant + appel api mocke
    - une page + state management
- test end to end
    - ouvrir une page
    - se connecter
    - cliquer 
    - naviguer
    - verifier qu un element apparait

## installation prerequise

npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D @playwright/test

## structure conseiller

src/
    components/
        Button.tsx
        Button.test.tsx
    lib/
        utils.ts
        utils.test.ts
tests/
    e2e/
        login.spec.ts



## comment savoir l app marche bien

- etape 1
    - npm run build
- etape 2 
    - npm run lint
- etape 3
    npx vitest
- etape 4 npx playwright test

## les librairies

- vitest permet de faire des test de fonction unitaire majoritairement

## les fonctions des librairies

- describe : sert a regrouper plusieurs tests
    - describe('add,() =>{}) : cree un bloc test pour la fonciton add
- test : sert a ecrire un test
    - test('adittione 2 nombres', () =>{}); : cree un test precis
- expect : sert a verifier un resultat
    - expect(add(2,3)).toBe(5); : verifie que l output est bien celle desiree
    - expect(handleClick).toHaveBeenCalledTimes(1);
        - verifie que handle click a bien ete clicker une fois
    - expect (await screen.findByText(/email requis/i)).toBeInTheDocument(); : attendre qu un texte apparait


- render affiche le composant dans un faux fom de test
    - render(<Button onClick={handleClick}>Valider</Button>) :permet d afficher le composant dans l environnement de test
- screen permet de rechercher des elements affiches
    - screen.getByRole('button',{name: /connexion/i}) : cherche un bouton connexion /../i insensible a la casse
- fireEvent : permet de simuler une action comme un clic
    fireEvent.click(screen.get.By.Text('Valider)); : chercher l element afficher ayant le text valider et simule un clic dessus
- vi sert a cree des mocks / fausses fonction
    -vi.fn :cree une fausse fonction espion pour regarder si elle a ete appelee combien de fois avec quels arguments


## assertions les plus utiles 
 
- .toBe compare une simple valeur
    - expect(2 + 2).toBe(4);
- .toEqual() compare les objet ou tableau
    - expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
- .toBeTruthy() verifie qu une valeur est vrai
    - expect(value).toBeTruthy();
- .toBeFalsy() verifie qu une valeur est fausse
    expect(value).toBeFalsy();
- .toContain