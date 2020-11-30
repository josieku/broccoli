// import { render, screen, fireEvent } from '@testing-library/react';
import { shallow, mount } from 'enzyme';
import App from './App';

test('renders the component', () => {
  const component = shallow(<App />);
  expect(component).toMatchSnapshot();
});

test('modal is not visible at start', () => {
  const component = mount(<App/>);
  expect(component.find('Modal').getDOMNode()).not.toBeVisible();
})

test('modal is visible on click', () => {
  const component = mount(<App/>);
  component.find('.App-content button').simulate('click');
  expect(component.find('Modal').getDOMNode()).toBeVisible();
})

test('side bar is visible on click, by checking classname', () => {
  const component = mount(<App/>);
  expect(component.find('.Side-menu').hasClass('open')).toEqual(false);
  component.find('.MenuButton').simulate('click');
  expect(component.find('.Side-menu').hasClass('open')).toEqual(true);
})