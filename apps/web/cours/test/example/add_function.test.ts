import {describe,expect, test } from 'vitest';
import {add} from './add_function'

describe('add', () =>{
    test(' addtionne 2 nombres', ()=>{
        expect(add(2,3)).toBe(5);
    });
});