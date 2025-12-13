
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { materialmodule } from '../../../../../Shared/Modules/materialmodule';
import { Nav } from '../../../Navbar/Pages/nav/nav';


interface Conversation {
  role: string;
  content: string;
}

interface UnresolvedQuery {
  conversation: Conversation[];
}

interface RowInfo {
  date: string;
  department: string;
  totalQuestions: number;
  successfulResolves: number;
  unresolvedQueries: number;
}
@Component({
  selector: 'app-conv',
  imports: [CommonModule, materialmodule, Nav, RouterModule],
  templateUrl: './conv.html',
  styleUrl: './conv.scss',
})


export class conv implements OnInit {
  conversations: UnresolvedQuery[] = [];
  rowInfo: RowInfo | null = null;
  selectedConversationIndex: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadConversations();
  }

  loadConversations(): void {
    const conversationsData = localStorage.getItem('selectedConversations');
    const rowInfoData = localStorage.getItem('selectedRowInfo');

    if (conversationsData) {
      this.conversations = JSON.parse(conversationsData);
    }

    if (rowInfoData) {
      this.rowInfo = JSON.parse(rowInfoData);
    }

    if (!conversationsData || !rowInfoData) {
      this.router.navigate(['/stats']);
    }
  }

  selectConversation(index: number): void {
    this.selectedConversationIndex = index;
  }

  getCurrentConversation(): Conversation[] {
    if (this.conversations && this.conversations[this.selectedConversationIndex]) {
      return this.conversations[this.selectedConversationIndex].conversation;
    }
    return [];
  }

  goBack(): void {
    this.router.navigate(['/stats']);
  }

  formatContent(content: string): string {
    // Convert markdown-style formatting to HTML
    let formatted = content
      // Bold text **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Links
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    return formatted;
  }
}