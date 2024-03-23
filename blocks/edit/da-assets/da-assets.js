import { getNx } from '../../../scripts/utils.js';
import getPathDetails from '../../shared/pathDetails.js';
import { DA_ORIGIN } from '../../shared/constants.js';
import { daFetch } from '../../shared/utils.js';

const { loadScript, loadStyle } = await import(`${getNx()}/scripts/nexter.js`);
const { loadIms } = await import(`${getNx()}/utils/ims.js`);

const details = await loadIms();
await loadStyle(import.meta.url.replace('.js', '.css'));
await loadScript('https://experience.adobe.com/solutions/CQ-assets-selectors/assets/resources/assets-selectors.js');

async function getAssetsConfig() {
  const { repo, owner } = getPathDetails();
  if (!(repo || owner)) return {};
  const resp = await daFetch(`${DA_ORIGIN}/config/${owner}/${repo}`);
  if (!resp.ok) return {};
  const json = await resp.json();
  return json.data.reduce((acc, conf) => {
    if (conf.key === 'aem.repositoryId' || conf.key === 'ims.org') {
      acc[conf.key] = conf.value;
    }
    return acc;
  }, {});
}

export default async function openAssets() {
  const assetsConf = await getAssetsConfig();
  if (!(assetsConf['aem.repositoryId'] && assetsConf['ims.org'])) return;

  let dialog = document.querySelector('.da-dialog-asset');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'da-dialog-asset';

    const inner = document.createElement('div');
    inner.className = 'da-dialog-asset-inner';

    dialog.append(inner);

    const main = document.body.querySelector('main');
    main.insertAdjacentElement('afterend', dialog);

    const selectorProps = {
      imsOrg: assetsConf['ims.org'],
      imsToken: details.accessToken.token,
      repositoryId: assetsConf['aem.repositoryId'],
      aemTierType: 'author',
      onClose: () => { dialog.close(); },
      handleSelection: (assets) => {
        const [asset] = assets;
        if (!asset) return;
        const repoId = asset['repo:repositoryId'];
        const format = asset['aem:formatName'];
        if (!format) return;
        const { path } = asset;
        const pubRepoId = repoId.replace('author', 'publish');
        const { view } = window;
        const { state } = view;
        dialog.close();

        const imgObj = { src: `https://${pubRepoId}${path}`, style: 'width: 180px' };
        const fpo = state.schema.nodes.image.create(imgObj);
        view.dispatch(state.tr.insert(state.selection.head, fpo).scrollIntoView());
      },
    };
    window.PureJSSelectors.renderAssetSelector(inner, selectorProps);
  }

  dialog.showModal();
}
