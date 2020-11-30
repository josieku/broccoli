import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { shallow, mount } from 'enzyme';
import App from './App';

test('renders the component', () => {
  const component = shallow(<App />);
  expect(component).toMatchSnapshot();
});

test("loading screen at start", () => {
  const component = shallow(<App/>);
  expect(component.find('.LoadForeground').hasClass('loading')).toEqual(true);
})

test("loading screen goes away after 2s", () => {
  jest.useFakeTimers();
  const component = mount(<App/>);
  act(()=>{
    jest.runAllTimers();
    component.update();
    expect(component.find('.LoadForeground').hasClass('loading')).toEqual(false);
    expect(component.find('.LoadForeground').hasClass('fade')).toEqual(false);
  })
})

describe('after loading screen', () => {
  let component: any;
  beforeEach(()=>{
    jest.useFakeTimers();
    component = mount(<App/>);
    act(()=>{
      jest.runAllTimers();
      component.update();
    })
  })

  test('modal is not visible at start', async () => {
    expect(component.find('Modal').getDOMNode()).not.toBeVisible();
  })
  
  test('modal is visible on click', () => {
    expect(component.find('Modal').at(0).getDOMNode()).not.toBeVisible();
    component.find('.App-content button').simulate('click');
    expect(component.find('Modal').getDOMNode()).toBeVisible();
  })

  test('modal closes on click background click', () => {
    component.find('.App-content button').simulate('click');
    component.find('.Modal-container').simulate('click');
    act(() => {
      jest.runAllTimers(); // wait for closing animation to finish
      component.update();
      expect(component.find('Modal').at(0).getDOMNode()).not.toBeVisible();
    })
  })

  test('modal closes on OK button click', async () => {
    component.find('.App-content button').simulate('click'); // open modal
    
    // fill in input fields
    component.find('input').at(0).simulate("change", { target: { value: 'test' }});
    component.find('input').at(1).simulate("change", { target: { value: 'test@test.com' }});
    component.find('input').at(2).simulate("change", { target: { value: 'test@test.com' }});

    // mock successful fetch
    const mockSuccessFetchPromise: Promise<any> = Promise.resolve({
      json: () => Promise.resolve("Registered"),
    });
    jest.spyOn(global, 'fetch').mockImplementation(():Promise<any> => mockSuccessFetchPromise);
    expect(component.find('.Modal-box.success').length).toBe(0);
    await act(async () => {
      jest.useRealTimers();
      component.find('.Modal-box button.box').simulate('click');
      await new Promise(resolve => setTimeout(resolve));
      component.update();
    });

    expect(component.find('.Modal-box.success').length).toBe(1); // find success modal 

    component.find('.Modal-box.success button.box').simulate('click'); // close modal
    expect(component.find('Modal').at(0).hasClass('open')).toEqual(false);
  })
  
  test('side bar is visible on click, by checking classname', () => {
    expect(component.find('.Side-menu').hasClass('open')).toEqual(false);
    component.find('.MenuButton').simulate('click');
    expect(component.find('.Side-menu').hasClass('open')).toEqual(true);
  })

  test('side bar closes by click on background', () => {
    component.find('.MenuButton').simulate('click');
    component.find('.Side-menu .background').simulate('click');
    act(() => {
      jest.runAllTimers(); // wait for closing animation to finish
      component.update();
      expect(component.find('.Side-menu').hasClass('open')).toEqual(false);
    })
  })
})