import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';

interface LoyaltyPageProps {
  onNavigate: (page: string) => void;
}

const LoyaltyPage: React.FC<LoyaltyPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'rules'>('members');
  const [editingMember, setEditingMember] = useState<any>(null);

  const members = [
    { id: 'CUS-001', name: 'Nguyễn Văn A', tier: 'Platinum', points: 15400, joined: '2022-01-15' },
    { id: 'CUS-002', name: 'Trần Thị B', tier: 'Gold', points: 8200, joined: '2023-05-20' },
    { id: 'CUS-003', name: 'Lê Văn C', tier: 'Silver', points: 3100, joined: '2024-02-10' },
    { id: 'CUS-004', name: 'Phạm Thị D', tier: 'Member', points: 850, joined: '2024-05-01' },
    { id: 'CUS-005', name: 'Hoàng Văn E', tier: 'Gold', points: 9500, joined: '2023-08-11' },
  ];

  const tierStyles: Record<string, { bg: string, color: string }> = {
    'Platinum': { bg: '#1e293b', color: '#cbd5e1' },
    'Gold': { bg: '#fef08a', color: '#854d0e' },
    'Silver': { bg: '#e2e8f0', color: '#475569' },
    'Member': { bg: '#eff6ff', color: '#0e74be' },
  };

  return (
    <AppLayout activeItem="loyalty" onNavigate={onNavigate} breadcrumb={[{ label: 'Khách Hàng', page: 'customers' }, { label: 'Tích Điểm & Hạng Thẻ' }]}>
      <div className="loyalty-page">
        <div className="page-header">
          <div className="header-titles">
            <h1>Tích Điểm & Hạng Thẻ</h1>
            <p>Quản lý chương trình khách hàng thân thiết Skyward Loyalty</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary">
              <span className="material-icons-round">add_circle</span> Thêm quy định
            </button>
          </div>
        </div>

        <div className="tier-cards">
          {[
            { tier: 'Platinum', count: 125, desc: '> 10,000 điểm', icon: 'diamond', color: '#cbd5e1', bg: 'linear-gradient(135deg, #0f172a, #334155)' },
            { tier: 'Gold', count: 450, desc: '5,000 - 9,999 điểm', icon: 'stars', color: '#ca8a04', bg: 'linear-gradient(135deg, #fef08a, #facc15)' },
            { tier: 'Silver', count: 1240, desc: '1,000 - 4,999 điểm', icon: 'workspace_premium', color: '#475569', bg: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)' },
            { tier: 'Member', count: 5800, desc: '< 1,000 điểm', icon: 'card_membership', color: '#0e74be', bg: 'linear-gradient(135deg, #eff6ff, #bae6fd)' }
          ].map(t => (
            <div key={t.tier} className="tier-summary-card" style={{ background: t.bg }}>
              <div className="tier-icon">
                <span className="material-icons-round" style={{ color: t.color }}>{t.icon}</span>
              </div>
              <div className="tier-info">
                <h3 style={{ color: t.tier === 'Platinum' ? '#fff' : '#1e293b' }}>{t.tier}</h3>
                <p style={{ color: t.tier === 'Platinum' ? '#cbd5e1' : '#64748b' }}>{t.desc}</p>
              </div>
              <div className="tier-count" style={{ color: t.tier === 'Platinum' ? '#fff' : '#1e293b' }}>
                {t.count.toLocaleString()} <small>khách</small>
              </div>
            </div>
          ))}
        </div>

        <div className="tab-bar">
          <button className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
            <span className="material-icons-round">people</span> Danh sách thành viên
          </button>
          <button className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
            <span className="material-icons-round">rule</span> Chính sách đổi điểm
          </button>
        </div>

        {activeTab === 'members' && (
          <Card className="table-card">
            <div className="table-actions">
              <div className="search-box">
                <span className="material-icons-round">search</span>
                <input type="text" placeholder="Tìm tên khách hàng, mã CUS..." />
              </div>
              <select className="filter-select">
                <option value="all">Tất cả hạng thẻ</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã KH</th>
                  <th>Khách hàng</th>
                  <th>Hạng thẻ</th>
                  <th>Điểm tích lũy</th>
                  <th>Ngày tham gia</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td><span className="mono-code">{m.id}</span></td>
                    <td className="font-semibold">{m.name}</td>
                    <td>
                      <span className="tier-badge" style={{ background: tierStyles[m.tier].bg, color: tierStyles[m.tier].color, display: 'inline-flex', alignItems: 'center' }}>
                        {m.tier === 'Platinum' && <span className="material-icons-round icon-xs" style={{marginRight: 4}}>diamond</span>}
                        {m.tier === 'Gold' && <span className="material-icons-round icon-xs" style={{marginRight: 4}}>stars</span>}
                        {m.tier}
                      </span>
                    </td>
                    <td className="points-text">{m.points.toLocaleString()} pts</td>
                    <td className="muted">{m.joined}</td>
                    <td>
                      <button className="btn-icon" onClick={() => setEditingMember(m)}><span className="material-icons-round">edit</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {activeTab === 'rules' && (
          <div className="rules-grid">
            <Card title="Quy định tích điểm">
              <ul className="rule-list">
                <li><span className="material-icons-round text-green">check_circle</span> Mua vé nội địa: 10,000 VND = 1 điểm</li>
                <li><span className="material-icons-round text-green">check_circle</span> Mua vé quốc tế: 10,000 VND = 1.5 điểm</li>
                <li><span className="material-icons-round text-green">check_circle</span> Mua thêm hành lý/dịch vụ: 10,000 VND = 2 điểm</li>
                <li><span className="material-icons-round text-orange">info</span> Điểm hết hạn sau 12 tháng kể từ ngày tích lũy.</li>
              </ul>
            </Card>
            <Card title="Quy định đổi thưởng">
              <ul className="rule-list">
                <li><span className="material-icons-round text-blue">card_giftcard</span> 1,000 điểm = Giảm 100,000 VND cho vé tiếp theo</li>
                <li><span className="material-icons-round text-blue">card_giftcard</span> 5,000 điểm = Miễn phí 20kg hành lý ký gửi</li>
                <li><span className="material-icons-round text-blue">card_giftcard</span> 10,000 điểm = Nâng hạng vé phổ thông lên thương gia (nội địa)</li>
              </ul>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Member Popup */}
      {editingMember && (
        <div className="loyalty-modal-backdrop" onClick={() => setEditingMember(null)}>
          <div className="loyalty-modal-box" onClick={e => e.stopPropagation()}>
            <div className="loyalty-modal-header">
              <div className="loyalty-modal-title">
                <div className="loyalty-modal-icon"><span className="material-icons-round">person</span></div>
                <div>
                  <h3>Chỉnh sửa Thành viên</h3>
                  <p>Mã CUS: <strong>{editingMember.id}</strong></p>
                </div>
              </div>
              <button className="loyalty-modal-close" onClick={() => setEditingMember(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="loyalty-modal-body">
              <div className="loyalty-form-group">
                <label>Tên khách hàng</label>
                <input type="text" defaultValue={editingMember.name} readOnly style={{ background: '#f8fafc', color: '#94a3b8' }} />
              </div>
              <div className="loyalty-form-group">
                <label>Hạng thẻ hiện tại</label>
                <select defaultValue={editingMember.tier}>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Member">Member</option>
                </select>
              </div>
              <div className="loyalty-form-group">
                <label>Số điểm tích lũy</label>
                <input type="number" defaultValue={editingMember.points} />
              </div>
              <div className="loyalty-form-group">
                <label>Ghi chú điều chỉnh</label>
                <textarea rows={3} placeholder="Lý do cộng/trừ điểm hoặc thay đổi hạng thẻ..."></textarea>
              </div>
            </div>
            <div className="loyalty-modal-footer">
              <button className="btn-cancel" onClick={() => setEditingMember(null)}>Hủy bỏ</button>
              <button className="btn-save" onClick={() => setEditingMember(null)}>
                <span className="material-icons-round">save</span> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Loyalty Modal Styles */
        .loyalty-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(3px); z-index: 2000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
        .loyalty-modal-box { background: white; border-radius: 16px; width: 440px; max-width: 90vw; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.18); overflow: hidden; }
        .loyalty-modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
        .loyalty-modal-title { display: flex; gap: 12px; align-items: center; }
        .loyalty-modal-icon { width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; color: #0e74be; display: flex; align-items: center; justify-content: center; }
        .loyalty-modal-title h3 { font-size: 17px; margin: 0; color: #1e293b; font-weight: 700; }
        .loyalty-modal-title p { font-size: 13px; color: #64748b; margin: 4px 0 0; }
        .loyalty-modal-close { background: transparent; border: none; cursor: pointer; color: #94a3b8; display: flex; }
        .loyalty-modal-close:hover { color: #1e293b; }
        .loyalty-modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .loyalty-form-group { display: flex; flex-direction: column; gap: 6px; }
        .loyalty-form-group label { font-size: 13px; font-weight: 600; color: #475569; }
        .loyalty-form-group input, .loyalty-form-group select, .loyalty-form-group textarea { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; font-family: inherit; }
        .loyalty-form-group input:focus, .loyalty-form-group select:focus, .loyalty-form-group textarea:focus { border-color: #0e74be; }
        .loyalty-modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #f1f5f9; background: #f8fafc; }
        .btn-cancel { padding: 10px 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; cursor: pointer; font-size: 14px; font-weight: 600; color: #64748b; }
        .btn-save { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 8px; background: #0e74be; color: white; cursor: pointer; font-size: 14px; font-weight: 600; }
        .btn-save:hover { background: #0b5a94; }

        .loyalty-page { padding: 24px 32px; animation: fadeIn 0.4s ease-out; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
        .header-titles h1 { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0; }
        .header-titles p { font-size: 14px; color: #64748b; margin: 0; }
        
        .btn-primary { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #0e74be; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-primary:hover { background: #0b5a94; }

        .tier-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
        .tier-summary-card { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .tier-icon { width: 48px; height: 48px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .tier-icon .material-icons-round { font-size: 28px; }
        .tier-info { flex: 1; }
        .tier-info h3 { font-size: 18px; font-weight: 800; margin: 0 0 2px 0; }
        .tier-info p { font-size: 12px; font-weight: 600; margin: 0; opacity: 0.8; }
        .tier-count { font-size: 24px; font-weight: 800; text-align: right; line-height: 1; }
        .tier-count small { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; opacity: 0.8; margin-top: 4px; }

        .tab-bar { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }
        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: transparent; border: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; border-radius: 8px; transition: all 0.2s; font-family: inherit; }
        .tab-btn:hover { background: #f1f5f9; color: #1e293b; }
        .tab-btn.active { background: #eff6ff; color: #0e74be; }

        .table-card { padding: 24px; }
        .table-actions { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .search-box { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; width: 300px; background: #f8fafc; }
        .search-box input { border: none; background: transparent; outline: none; width: 100%; font-size: 14px; }
        .filter-select { padding: 10px 16px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-weight: 600; color: #1e293b; outline: none; background: white; }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 700; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #f8fafc; text-transform: uppercase; }
        .data-table td { padding: 16px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .mono-code { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; color: #475569; font-weight: 600; }
        .font-semibold { font-weight: 600; }
        .muted { color: #94a3b8; font-size: 13px; }
        .points-text { font-weight: 800; color: #0e74be; }
        .tier-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block; }
        .icon-xs { font-size: 14px; }
        .btn-icon { width: 32px; height: 32px; border: none; border-radius: 6px; background: #eff6ff; color: #0e74be; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .btn-icon:hover { background: #dbeafe; }

        .rules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .rule-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
        .rule-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; color: #334155; line-height: 1.5; }
        .text-green { color: #10b981; }
        .text-orange { color: #f59e0b; }
        .text-blue { color: #3b82f6; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default LoyaltyPage;
