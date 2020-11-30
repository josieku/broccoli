import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import {jest} from '@jest/globals';
import Modal from './index';

describe('renders the component', () => {
  it("matches snapshot", ()=> {
    const component = mount(<Modal show={"open"} onClose={()=>{}} />);
    expect(component).toMatchSnapshot();
  })
});

describe('input fields general validation', () => {
    let component:any;

    beforeEach(()=>{
        component = mount(<Modal show={"open"} onClose={()=>{}} />);
    })

    it("Name input changes", () => {
        component.find('input').at(0).simulate("change", { target: { value: 'Test' }});
        expect(component.find('input').at(0).props().value).toEqual('Test');
    })

    it("Email input changes", () => {
        component.find('input').at(1).simulate("change", { target: { value: 'Test' }});
        expect(component.find('input').at(1).props().value).toEqual('Test');
    })

    it("ConfirmEmail input changes", () => {
        component.find('input').at(2).simulate("change", { target: { value: 'Test' }});
        expect(component.find('input').at(2).props().value).toEqual('Test');
    })

    it("all fields must be filled", () => {
        expect(component.find('.input-container.error').children().length).toEqual(0);
        component.find('button.box').simulate('click');
        expect(component.find('.input-container.error').childAt(0).props().children).toEqual('Please fill in all fields');
    })
})

describe('input fields field specific validation', () => {
    let component:any;

    beforeEach(()=>{
        component = mount(<Modal show={"open"} onClose={()=>{}} />);
        component.find('input').at(0).simulate("change", { target: { value: 'test' }});
        component.find('input').at(1).simulate("change", { target: { value: 'test@test.com' }});
        component.find('input').at(2).simulate("change", { target: { value: 'test@test.com' }});
    })

    describe("Name Input", () => {
        it("Full name must have over 3 characters ('ff')", () => {
            component.find('input').at(0).simulate("change", { target: { value: 'ff' }});
            component.find('button.box').simulate('click');
            expect(component.find('.input-container.error').childAt(0).props().children).toEqual('Full Name must have over 3 characters');
        })

        it("Full name with over 3 characters work ('test')", () => {
            component.find('button.box').simulate('click');
            expect(component.find('button.box').props().children).toEqual('Sending, please wait...');
        })
    })

    describe("Email Input", ()=> {
        it("Email must be valid (ffff)", () => {
            component.find('input').at(1).simulate("change", { target: { value: 'ffff' }});
            component.find('button.box').simulate('click');
            expect(component.find('.input-container.error').childAt(0).props().children).toEqual('Invalid email');
        })

        it("Email must be valid (test@test@com)", () => {
            component.find('input').at(1).simulate("change", { target: { value: 'test@test@com' }});
            component.find('button.box').simulate('click');
            expect(component.find('.input-container.error').childAt(0).props().children).toEqual('Invalid email');
        })
    
        it("Email must be valid (test@.com)", () => {
            component.find('input').at(1).simulate("change", { target: { value: 'test@.com' }});
            component.find('button.box').simulate('click');
            expect(component.find('.input-container.error').childAt(0).props().children).toEqual('Invalid email');
        })
    })

    describe("Confirm Email Input", ()=>{
        it("Confirmation email must match email", () => {
            component.find('input').at(2).simulate("change", { target: { value: 'ff' }});
            component.find('button.box').simulate('click');
            expect(component.find('.input-container.error').childAt(0).props().children).toEqual('Second email does not match the first');
        })
    })

    describe("Request handling", () => {
        const mockSuccessFetchPromise = Promise.resolve({
            json: () => Promise.resolve("Registered"),
        });
        const mockFailFetchPromise: Promise<any> = Promise.resolve({ 
            json: () => Promise.resolve({errorMessage: "Bad Request"}),
        });

        const waitForComponentToFetch = async () => {
            await act(async () => {
                component.find('button.box').simulate('click');
                await new Promise(resolve => setTimeout(resolve));
                component.update();
            });
          };
        
        it("Failed request, shows error message", async () => {
            jest.spyOn(global, 'fetch').mockImplementation(():Promise<any> => mockFailFetchPromise);
            await waitForComponentToFetch();
            expect(component.find('.input-container.error').childAt(0).props().children).toEqual('Error message from server');        
        })

        it("Success request, moves onto success screen", async () => {
            jest.spyOn(global, 'fetch').mockImplementation(():Promise<any> => mockSuccessFetchPromise);
            expect(component.find('.Modal-box.success').length).toBe(0);
            await waitForComponentToFetch();
            expect(component.find('.Modal-box.success').length).toBe(1);
        })
    })

})