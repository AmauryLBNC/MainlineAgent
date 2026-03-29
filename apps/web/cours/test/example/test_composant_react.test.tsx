import {render,screen ,fireEvent} from '@testing-library/react';
import {vi} from 'vitest';
import Button from './test_composant_react'

test('appelle onClick quand on clique',() =>{
    const handleClick = vi.fn();
    render(<Button onClick = {handleClick}>valider</Button>);
    fireEvent.click(screen.getByText('valider'));
    expect(handleClick).toHaveBeenCalledTimes(1);
})