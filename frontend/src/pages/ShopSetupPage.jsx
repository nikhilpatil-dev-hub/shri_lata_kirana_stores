import { MapPin, Phone, Store, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { businessService } from '../services/business.service'
import { getApiError } from '../api/client'
import { useLanguage } from '../context/useLanguage'
import { useAuth } from '../context/useAuth'

export default function ShopSetupPage() {
  const { t } = useLanguage(); const { user } = useAuth(); const navigate = useNavigate(); const [saving, setSaving] = useState(false); const [form, setForm] = useState({ shopName: '', ownerName: [user?.firstName, user?.lastName].filter(Boolean).join(' '), mobileNumber: user?.mobileNumber || '', address: '', defaultCreditPeriod: 30 })
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value })
  const submit = async (event) => { event.preventDefault(); setSaving(true); try { await businessService.createShop({ ...form, defaultCreditPeriod: Number(form.defaultCreditPeriod) }); toast.success(t('shop.created')); navigate('/dashboard', { replace: true }) } catch (error) { toast.error(getApiError(error)) } finally { setSaving(false) } }
  return <section className="shop-setup"><div className="setup-intro"><div className="setup-mark"><Store size={27}/></div><p>{t('shop.welcome')}</p><h2>{t('shop.title')}</h2><span>{t('shop.description')}</span></div><form className="setup-form" onSubmit={submit}><label><span><Store size={16}/>{t('shop.shopName')}</span><input required value={form.shopName} onChange={update('shopName')} placeholder={t('shop.shopNameExample')}/></label><label><span><UserRound size={16}/>{t('shop.ownerName')}</span><input required value={form.ownerName} onChange={update('ownerName')} /></label><label><span><Phone size={16}/>{t('shop.mobile')}</span><input required inputMode="tel" value={form.mobileNumber} onChange={update('mobileNumber')} placeholder="+919876543210"/></label><label><span><MapPin size={16}/>{t('shop.address')}</span><textarea value={form.address} onChange={update('address')} placeholder={t('shop.addressExample')}/></label><label><span>{t('shop.creditPeriod')}</span><select value={form.defaultCreditPeriod} onChange={update('defaultCreditPeriod')}><option value="0">{t('shop.noCredit')}</option><option value="7">7 {t('shop.days')}</option><option value="15">15 {t('shop.days')}</option><option value="30">30 {t('shop.days')}</option><option value="45">45 {t('shop.days')}</option></select></label><button className="setup-submit" disabled={saving}>{saving ? t('shop.creating') : t('shop.create')}</button></form></section>
}
