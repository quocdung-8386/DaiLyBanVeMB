import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';

interface LoyaltyPageProps {
  onNavigate?: (id: string) => void;
}

const LoyaltyPage: React.FC<LoyaltyPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'rules'>('members');
  const [editingMember, setEditingMember] = useState<any>(null);

  const members = [
    { id: 'CUS-001', name: 'Nguyễn Văn Trường', tier: 'Gold', points: 15400, joined: '2022-01-15', initials: 'NT' },
    { id: 'CUS-002', name: 'Trần Thị Lan', tier: 'Platinum', points: 32000, joined: '2021-05-20', initials: 'TL' },
    { id: 'CUS-003', name: 'Lê Quang Minh', tier: 'Silver', points: 5200, joined: '2023-02-10', initials: 'LM' },
    { id: 'CUS-004', name: 'Phạm Thu Hà', tier: 'Member', points: 1200, joined: '2023-08-01', initials: 'PH' },
  ];

  return (
    <AppLayout 
      activeItem="loyalty" 
      onNavigate={onNavigate || (() => {})}
      breadcrumb={[{ label: 'Khách hàng', page: 'customers' }, { label: 'Chương trình khách hàng thân thiết' }]}
    >
      <div className="loyalty-page-content">
        
        {/* ── HEADER ── */}
        <div className="page-header-flex">
          <div>
            <h1>Skyward Loyalty Dashboard</h1>
            <p>Quản lý chương trình khách hàng thân thiết và chính sách tích lũy điểm.</p>
          </div>
          <div className="action-buttons">
            <Button variant="outline"><span className="material-icons-round">history</span> Lịch sử điểm</Button>
            <Button><span className="material-icons-round">settings</span> Cấu hình chính sách</Button>
          </div>
        </div>

        {/* ── TIER OVERVIEW ── */}
        <div className="tier-cards-grid">
          {[
            { tier: 'Platinum', count: 125, icon: 'diamond', color: '#1e293b', points: 'Trên 30,000 pts' },
            { tier: 'Gold', count: 450, icon: 'stars', color: '#f59e0b', points: '10,000 - 30,000 pts' },
            { tier: 'Silver', count: 1240, icon: 'workspace_premium', color: '#64748b', points: '2,000 - 9,999 pts' },
            { tier: 'Member', count: 5800, icon: 'person', color: '#94a3b8', points: 'Dưới 2,000 pts' }
          ].map(t => (
            <Card key={t.tier} className="tier-summary-card">
              <div className="tier-icon-circle" style={{ color: t.color, background: `${t.color}15` }}>
                <span className="material-icons-round">{t.icon}</span>
              </div>
              <div className="tier-info">
                <h3>{t.tier}</h3>
                <p>{t.points}</p>
              </div>
              <div className="tier-stats">
                <b>{t.count.toLocaleString()}</b>
                <span>khách</span>
              </div>
            </Card>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="content-tabs">
          <button className={`tab-link ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
            <span className="material-icons-round">groups</span> Xếp hạng thành viên
          </button>
          <button className={`tab-link ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
            <span className="material-icons-round">rule</span> Chính sách tích điểm & đổi quà
          </button>
        </div>

        {activeTab === 'members' ? (
          <Card className="loyalty-data-card">
            <div className="toolbar">
              <div className="search-premium">
                <span className="material-icons-round">search</span>
                <input type="text" placeholder="Tìm thành viên..." />
              </div>
              <Button variant="outline" size="sm">Lọc theo hạng</Button>
            </div>
            <div className="table-overflow">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>THÀNH VIÊN</th>
                    <th>HẠNG HIỆN TẠI</th>
                    <th>ĐIỂM TÍCH LŨY</th>
                    <th>NGÀY THAM GIA</th>
                    <th>TIẾN TRÌNH LÊN HẠNG</th>
                    <th>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id}>
                      <td>
                        <div className="user-info">
                          <div className="avatar-sm">{m.initials}</div>
                          <div>
                            <p className="name">{m.name}</p>
                            <p className="id">{m.id}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className={`tier-tag ${m.tier.toLowerCase()}`}>{m.tier}</span></td>
                      <td><b className="points-val">{m.points.toLocaleString()} pts</b></td>
                      <td><p className="date-val">{m.joined}</p></td>
                      <td>
                        <div className="progress-container">
                          <div className="progress-bar" style={{ width: `${Math.min((m.points / 50000) * 100, 100)}%` }}></div>
                          <span className="progress-text">{Math.round(Math.min((m.points / 50000) * 100, 100))}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="action-circle-btn" onClick={() => setEditingMember(m)}><span className="material-icons-round">edit</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="rules-grid">
            <Card className="rule-card">
              <div className="rule-header">
                <span className="material-icons-round text-success">add_task</span>
                <h3>Cơ chế tích lũy điểm</h3>
              </div>
              <ul className="rule-list">
                <li><span className="bullet"></span> Mua vé nội địa: 10,000đ = <b>1 điểm</b></li>
                <li><span className="bullet"></span> Mua vé quốc tế: 10,000đ = <b>1.5 điểm</b></li>
                <li><span className="bullet"></span> Mua thêm hành lý: 10,000đ = <b>2 điểm</b></li>
              </ul>
              <Button variant="outline" className="w-full mt-md">Chỉnh sửa cơ chế</Button>
            </Card>
            <Card className="rule-card">
              <div className="rule-header">
                <span className="material-icons-round text-primary">card_giftcard</span>
                <h3>Chính sách đổi thưởng</h3>
              </div>
              <ul className="rule-list">
                <li><span className="bullet"></span> 1,000 điểm = Giảm <b>100,000đ</b> cho vé mới</li>
                <li><span className="bullet"></span> 5,000 điểm = Miễn phí <b>20kg hành lý</b></li>
                <li><span className="bullet"></span> 20,000 điểm = Vé khứ hồi nội địa <b>0đ</b></li>
              </ul>
              <Button variant="outline" className="w-full mt-md">Quản lý kho quà</Button>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        .loyalty-page-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 24px; color: #1e293b; }
        .page-header-flex p { font-size: 14px; color: #64748b; }
        .action-buttons { display: flex; gap: 12px; }

        .tier-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .tier-summary-card { display: flex; align-items: center; gap: 16px; padding: 20px; border: none; }
        .tier-icon-circle { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .tier-info h3 { font-size: 16px; color: #1e293b; margin-bottom: 2px; }
        .tier-info p { font-size: 11px; color: #94a3b8; font-weight: 600; }
        .tier-stats { margin-left: auto; text-align: right; }
        .tier-stats b { display: block; font-size: 18px; color: #1e293b; }
        .tier-stats span { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }

        .content-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .tab-link { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
        .tab-link:hover { background: #f8fafc; color: #2563eb; }
        .tab-link.active { background: #eff6ff; color: #2563eb; }

        .loyalty-data-card { padding: 0; overflow: hidden; border: none; }
        .toolbar { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
        .search-premium { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 6px 14px; width: 280px; }
        .search-premium input { border: none; outline: none; font-size: 13px; width: 100%; }
        .search-premium .material-icons-round { color: #94a3b8; font-size: 18px; }

        .table-overflow { width: 100%; overflow-x: auto; }
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { padding: 14px 24px; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; text-align: left; }
        .premium-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; }
        
        .user-info { display: flex; align-items: center; gap: 12px; }
        .avatar-sm { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; }
        .user-info .name { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
        .user-info .id { font-size: 11px; color: #94a3b8; font-weight: 600; }
        
        .tier-tag { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .tier-tag.platinum { background: #1e293b; color: white; }
        .tier-tag.gold { background: #fef3c7; color: #b45309; }
        .tier-tag.silver { background: #f1f5f9; color: #475569; }
        .tier-tag.member { background: #f8fafc; color: #94a3b8; }

        .points-val { font-size: 14px; color: #2563eb; }
        .date-val { font-size: 13px; color: #64748b; font-weight: 500; }

        .progress-container { width: 120px; display: flex; align-items: center; gap: 8px; }
        .progress-bar { flex: 1; height: 6px; background: #f1f5f9; border-radius: 3px; position: relative; overflow: hidden; }
        .progress-bar::after { content: ''; position: absolute; top: 0; left: 0; height: 100%; background: #2563eb; width: var(--p-width); }
        .progress-text { font-size: 11px; color: #94a3b8; font-weight: 700; }

        .action-circle-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: #f8fafc; color: #94a3b8; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .action-circle-btn:hover { background: #eff6ff; color: #2563eb; }

        .rules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .rule-card { padding: 24px; border: none; }
        .rule-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .rule-header h3 { font-size: 16px; color: #1e293b; }
        .rule-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
        .rule-list li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #475569; }
        .bullet { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; }
        .mt-md { margin-top: 16px; }
        .w-full { width: 100%; }
        .text-success { color: #10b981; }
      `}</style>
    </AppLayout>
  );
};

export default LoyaltyPage;
