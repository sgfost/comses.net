import logging
import shortuuid

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Codebase, CodebaseRelease
from .tasks import update_mirrored_release_metadata, update_mirrored_codebase_metadata

logger = logging.getLogger(__name__)


@receiver(
    post_save, sender=CodebaseRelease, dispatch_uid="update_mirrored_release_metadata"
)
def on_codebase_release_save(sender, instance: CodebaseRelease, **kwargs):
    """
    update the metadata in the git mirror for a codebase release if it has a git mirror
    and the metadata changed
    """
    release = instance
    codebase = release.codebase
    mirror = codebase.git_mirror
    if mirror and mirror.remote_url:
        update_mirrored_release_metadata(release.id)


@receiver(post_save, sender=Codebase, dispatch_uid="update_mirrored_codebase_metadata")
def on_codebase_save(sender, instance: Codebase, **kwargs):
    """
    update the metadata in the git mirror for a codebase if it has a git mirror
    and the metadata changed
    """
    codebase = instance
    mirror = codebase.git_mirror
    if mirror and mirror.remote_url:
        update_mirrored_codebase_metadata(codebase.id)
