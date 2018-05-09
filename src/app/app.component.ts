import { Component, ViewEncapsulation } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormArray } from '@angular/forms';

import { AddTodo, RemoveTodo, TodoState, SetPrefix, TodosState, LoadData } from './todo.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @Select(TodoState) todos$: Observable<string[]>;
  @Select(TodoState.pandas) pandas$: Observable<string[]>;
  @Select(TodosState.pizza) pizza$: Observable<any>;

  allExtras = [
    { name: 'cheese', selected: false },
    { name: 'mushrooms', selected: false },
    { name: 'olives', selected: false }
  ];

  pizzaForm = this.formBuilder.group({
    toppings: [''],
    crust: [{ value: 'thin', disabled: true }],
    extras: this.createExtras()
  });

  constructor(private store: Store, private formBuilder: FormBuilder) {}

  addTodo(todo: string) {
    this.store.dispatch(new AddTodo(todo));
  }

  removeTodo(index: number) {
    this.store.dispatch(new RemoveTodo(index)).subscribe(() => {
      console.log('Removed!');
    });
  }

  createExtras() {
    const arr = this.allExtras.map(extra => {
      return this.formBuilder.control(extra.selected);
    });
    return this.formBuilder.array(arr);
  }

  get extras() {
    const ctl: FormArray = <FormArray>this.pizzaForm.get('extras');
    return ctl.controls;
  }

  onSubmit() {
    this.pizzaForm.patchValue({
      toppings: 'olives'
    });
  }

  onPrefix() {
    this.store.dispatch(new SetPrefix());
  }

  onLoadData() {
    this.store.dispatch(new LoadData());
  }
}
