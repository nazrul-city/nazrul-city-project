import { ProjectCtaBarActions } from '@/components/shared/project-cta-bar-actions';
import { getSiteContact } from '@/config/site-contact';

type TProjectCtaBarProps = {
  name: string;
};

export async function ProjectCtaBar({ name }: Readonly<TProjectCtaBarProps>) {
  const contact = await getSiteContact();

  return (
    <ProjectCtaBarActions name={name} phone={contact.primaryPhone} whatsapp={contact.whatsapp} />
  );
}
