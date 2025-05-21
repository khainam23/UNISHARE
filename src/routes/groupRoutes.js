import React from 'react';
import { Route } from 'react-router-dom';
import GroupDetailPage from '../pages/GroupDetailPage';
import GroupDocumentUpload from '../components/groups/GroupDocumentUpload';
import DocumentViewer from '../components/documents/DocumentViewer';
import GroupManagePage from '../pages/GroupManagePage';
import GroupEditPage from '../pages/GroupEditPage';
import GroupChatPage from '../pages/GroupChatPage';

/**
 * Routes related to group functionality
 */
const groupRoutes = [
  <Route key="group-detail" path="/unishare/groups/:groupId" element={<GroupDetailPage />} />,
  <Route key="group-documents-upload" path="/unishare/groups/:groupId/documents/upload" element={<GroupDocumentUpload />} />,
  <Route key="document-view" path="/unishare/documents/view/:documentId" element={<DocumentViewer />} />,
  <Route key="group-manage-members" path="/unishare/groups/:groupId/members/manage" element={<GroupManagePage />} />,
  <Route key="group-edit" path="/unishare/groups/:groupId/edit" element={<GroupEditPage />} />,
  <Route key="group-chat" path="/unishare/groups/:groupId/chat" element={<GroupChatPage />} />
];

export default groupRoutes;
