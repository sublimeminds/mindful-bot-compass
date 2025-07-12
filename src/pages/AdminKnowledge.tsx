import { InitializeKnowledgeBase } from '@/components/admin/InitializeKnowledgeBase';

const AdminKnowledge = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Knowledge Management</h1>
      <InitializeKnowledgeBase />
    </div>
  );
};

export default AdminKnowledge;