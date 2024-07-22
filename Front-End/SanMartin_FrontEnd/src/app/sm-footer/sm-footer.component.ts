import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sm-footer',
  standalone: true,
  imports: [],
  templateUrl: './sm-footer.component.html',
  styleUrl: './sm-footer.component.scss'
})
export class SmFooterComponent {
  pageId?:number;
  @Output() pageIdChange = new EventEmitter<number>();
  emitPageId(){
    this.pageIdChange.emit(this.pageId);
  }
}
