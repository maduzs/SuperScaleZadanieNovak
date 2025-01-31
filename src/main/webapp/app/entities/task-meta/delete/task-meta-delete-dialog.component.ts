import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITaskMeta } from '../task-meta.model';
import { TaskMetaService } from '../service/task-meta.service';

@Component({
  templateUrl: './task-meta-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TaskMetaDeleteDialogComponent {
  taskMeta?: ITaskMeta;

  protected taskMetaService = inject(TaskMetaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.taskMetaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
