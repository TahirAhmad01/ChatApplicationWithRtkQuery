function getPartnerInfo(partners, userEmail) {
  return partners.find((partner) => partner.email !== userEmail);
}

export default getPartnerInfo;
