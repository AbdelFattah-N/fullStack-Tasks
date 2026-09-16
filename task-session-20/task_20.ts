import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TeamMember {
  name: string;
  age: number;
  department: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-team-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task_20.html',
  styles: [`
    :host { display: block; }
  `]
})
export class TeamManagerComponent {
  viewMode: 'card' | 'list' = 'card';

  departments: string[] = ['Development', 'Marketing', 'Design'];

  selectedDept: string = 'All';

  newMember: TeamMember = {
    name: '',
    age: 0,
    department: this.departments[0],
    isAvailable: true
  };

  team: TeamMember[] = [
    { name: 'Esraa Said', age: 24, department: 'Development', isAvailable: true },
    { name: 'Ahmed Hassan', age: 29, department: 'Marketing', isAvailable: false },
    { name: 'Laila Mahmoud', age: 31, department: 'Design', isAvailable: true }
  ];

  get filteredTeam(): TeamMember[] {
    if (this.selectedDept === 'All') {
      return this.team;
    }
    return this.team.filter(member => member.department === this.selectedDept);
  }

  addMember(): void {
    if (this.newMember.name.trim() && this.newMember.age > 0 && this.newMember.department) {
      this.team.push({ ...this.newMember });
      this.resetForm();
    }
  }

  toggleAvailability(member: TeamMember): void {
    member.isAvailable = !member.isAvailable;
  }

  removeMember(member: TeamMember): void {
    const index = this.team.indexOf(member);
    if (index !== -1) {
      this.team.splice(index, 1);
    }
  }

  private resetForm(): void {
    this.newMember = {
      name: '',
      age: 0,
      department: this.departments[0],
      isAvailable: true
    };
  }
}
