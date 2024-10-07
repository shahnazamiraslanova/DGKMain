export interface Option {
    id: number;
    optionContent: string;
  }
  
  export interface Poll {
    pollId: number;
    pollTitle: string;
    userId: number;
    options: Option[];
    firmIds: number[];
  }
  
  export interface Firm {
    id: string;
    name: string;
  }
  
  export interface Vote {
    optionId: number;
    count: number;
  }
  export interface PollListProps {
    polls: any[];
    onEdit: (poll: any) => void;
    onDelete: (id: any) => void;
    onViewVotes: (id: any) => void;
    isSubmitting: boolean;
  }
  export interface VoteDetailsModalProps {
    visible: boolean;
    onCancel: () => void;
    voteDetails: {
      options: any[];
      user: any[];
    };
  }

   export interface PollFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any, isEditing: boolean) => void;
    editingPoll: any;
    firms: any[];
    isSubmitting: boolean;
  }