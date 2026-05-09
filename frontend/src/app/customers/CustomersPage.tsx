import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';

interface CustomersPageProps {
  onNavigate?: (id: string) => void;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const metrics = [
    { title: 'Tổng Khách hàng', value: '1,248', change: '+12%', icon: 'groups', color: '#2563eb' },
    { title: 'Khách hàng mới', value: '45', change: '+5%', icon: 'person_add', color: '#10b981' },
    { title: 'Hạng VIP', value: '186', change: '0%', icon: 'workspace_premium', color: '#f59e0b' },
  ];

  const customers = [
    { id: 'CUS-001', name: 'Nguyễn Văn Trường', email: 'truong.nv@gmail.com', phone: '0901234567', tier: 'Gold', points: 15400, lastBooking: '12/10/2023', initials: 'NT', spent: '124,500,000 đ' },
    { id: 'CUS-002', name: 'Trần Thị Lan', email: 'lan.tran99@yahoo.com', phone: '0987654321', tier: 'Platinum', points: 32000, lastBooking: '15/10/2023', initials: 'TL', spent: '285,000,000 đ' },
    { id: 'CUS-003', name: 'Lê Quang Minh', email: 'minhlq.work@outlook.com', phone: '0912345678', tier: 'Silver', points: 5200, lastBooking: '05/09/2023', initials: 'LM', spent: '42,000,000 đ' },
    { id: 'CUS-004', name: 'Phạm Thu Hà', email: 'hapham.arch@gmail.com', phone: '0934567890', tier: 'Member', points: 1200, lastBooking: '20/08/2023', initials: 'PH', spent: '8,500,000 đ' },
    { id: 'CUS-005', name: 'Đoàn Nhật Nam', email: 'nam.doan@company.vn', phone: '0976543210', tier: 'Gold', points: 18500, lastBooking: '28/09/2023', initials: 'ĐN', spent: '156,000,000 đ' },
  ];

  return (
    <AppLayout 
      activeItem="customers" 
      onNavigate={onNavigate || (() => {})}
      breadcrumb={[{ label: 'Hệ thống', page: 'dashboard' }, { label: 'Khách hàng' }]}
    >
      <div className="customers-page-content">
        
        {/* ── HEADER: Operational Focus ── */}
        <div className="page-header-flex">
          <div>
            <h1>Hồ sơ Khách hàng</h1>
            <p>Quản lý định danh và lòng trung thành của hành khách.</p>
          </div>
          <div className="action-buttons">
            <Button variant="outline"><span className="material-icons-round">cloud_download</span> Xuất Excel</Button>
            <Button onClick={() => setShowCustomerModal(true)}><span className="material-icons-round">add</span> Thêm khách hàng</Button>
          </div>
        </div>

        {/* ── METRICS: Top Level View ── */}
        <div className="metrics-row">
          {metrics.map((m, i) => (
            <Card key={i} className="metric-pill">
              <div className="metric-icon" style={{ color: m.color, background: `${m.color}15` }}>
                <span className="material-icons-round">{m.icon}</span>
              </div>
              <div className="metric-data">
                <p>{m.title}</p>
                <h3>{m.value}</h3>
              </div>
              <span className={`metric-trend ${m.change.startsWith('+') ? 'up' : 'stable'}`}>{m.change}</span>
            </Card>
          ))}
        </div>

        {/* ── FILTERS & DATA ── */}
        <Card className="data-management-card">
          <div className="data-toolbar">
            <div className="search-box-premium">
              <span className="material-icons-round">search</span>
              <input type="text" placeholder="Tìm kiếm theo tên, SĐT, Email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="filter-chips">
              <span className="chip active">Tất cả</span>
              <span className="chip">Platinum</span>
              <span className="chip">Gold</span>
              <span className="chip">Silver</span>
            </div>
          </div>

          <div className="premium-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>KHÁCH HÀNG</th>
                  <th>LIÊN HỆ</th>
                  <th>HẠNG THẺ</th>
                  <th>ĐIỂM TÍCH LŨY</th>
                  <th>TỔNG CHI TIÊU</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="avatar-circle">{c.initials}</div>
                        <div>
                          <p className="name">{c.name}</p>
                          <p className="id">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <p><span className="material-icons-round">phone</span> {c.phone}</p>
                        <p className="sub"><span className="material-icons-round">mail</span> {c.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`tier-tag ${c.tier.toLowerCase()}`}>
                        {c.tier}
                      </span>
                    </td>
                    <td><b className="points">{c.points.toLocaleString()} pts</b></td>
                    <td><p className="spent-val">{c.spent}</p></td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" onClick={() => setViewingItem(c)}><span className="material-icons-round">visibility</span></button>
                        <button className="icon-btn" onClick={() => { setEditingCustomer(c); setShowCustomerModal(true); }}><span className="material-icons-round">edit</span></button>
                        <button className="icon-btn delete"><span className="material-icons-round">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer-pagination">
            <p>Hiển thị 5 trên 1,248 khách hàng</p>
            <div className="page-nav">
              <button className="nav-btn"><span className="material-icons-round">chevron_left</span></button>
              <button className="nav-btn active">1</button>
              <button className="nav-btn">2</button>
              <button className="nav-btn">3</button>
              <button className="nav-btn"><span className="material-icons-round">chevron_right</span></button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal & Style */}
      <style>{`
        .customers-page-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 24px; color: #1e293b; margin-bottom: 4px; }
        .page-header-flex p { font-size: 14px; color: #64748b; }
        .action-buttons { display: flex; gap: 12px; }

        .metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
        .metric-pill { display: flex; align-items: center; gap: 16px; padding: 20px; border: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .metric-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .metric-data p { font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
        .metric-data h3 { font-size: 24px; color: #1e293b; }
        .metric-trend { margin-left: auto; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 20px; }
        .metric-trend.up { background: #dcfce7; color: #15803d; }
        .metric-trend.stable { background: #f1f5f9; color: #64748b; }

        .data-management-card { padding: 0; overflow: hidden; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .data-toolbar { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
        .search-box-premium { display: flex; align-items: center; gap: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 16px; width: 320px; }
        .search-box-premium input { border: none; outline: none; font-size: 14px; width: 100%; }
        .search-box-premium .material-icons-round { color: #94a3b8; }
        .filter-chips { display: flex; gap: 8px; }
        .chip { padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .chip:hover { color: #2563eb; background: #eff6ff; }
        .chip.active { background: #2563eb; color: white; }

        .premium-table-wrapper { width: 100%; overflow-x: auto; }
        .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
        .premium-table th { padding: 16px 24px; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        .premium-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        
        .user-profile-cell { display: flex; align-items: center; gap: 14px; }
        .avatar-circle { width: 40px; height: 40px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        .user-profile-cell .name { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
        .user-profile-cell .id { font-size: 11px; color: #94a3b8; font-weight: 600; }
        
        .contact-cell p { font-size: 13px; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
        .contact-cell .sub { font-size: 12px; color: #94a3b8; font-weight: 500; }
        .contact-cell .material-icons-round { font-size: 14px; color: #cbd5e1; }

        .tier-tag { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; border: 1px solid transparent; }
        .tier-tag.platinum { background: #1e293b; color: white; }
        .tier-tag.gold { background: #fef3c7; color: #b45309; border-color: #fcd34d; }
        .tier-tag.silver { background: #f1f5f9; color: #475569; border-color: #e2e8f0; }
        .tier-tag.member { background: #f8fafc; color: #94a3b8; border-color: #f1f5f9; }

        .points { font-size: 14px; color: #2563eb; }
        .spent-val { font-size: 14px; font-weight: 700; color: #1e293b; }

        .table-actions { display: flex; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: #f1f5f9; color: #2563eb; }
        .icon-btn.delete:hover { color: #ef4444; background: #fee2e2; }

        .table-footer-pagination { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
        .table-footer-pagination p { font-size: 13px; color: #64748b; font-weight: 500; }
        .page-nav { display: flex; gap: 4px; }
        .nav-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .nav-btn:hover { border-color: #2563eb; color: #2563eb; }
        .nav-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
      `}</style>
    </AppLayout>
  );
};

export default CustomersPage;
