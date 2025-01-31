import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ITaskConfig } from '../task-config.model';
import { TaskConfigService } from '../service/task-config.service';

@Component({
  templateUrl: './task-config-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class TaskConfigDeleteDialogComponent {
  taskConfig?: ITaskConfig;

  protected taskConfigService = inject(TaskConfigService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.taskConfigService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
